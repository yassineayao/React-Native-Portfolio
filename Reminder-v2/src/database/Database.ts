import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { DBname, locale } from "../constants/settings";
import { Count, Gaurantor, Vehicle } from "../types";

async function openDatabase(): Promise<SQLite.WebSQLDatabase> {
  if (
    !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite"))
      .exists
  ) {
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "SQLite"
    );
  }
  return SQLite.openDatabase(DBname);
}

class _Database {
  db: SQLite.WebSQLDatabase | null = null;

  constructor() {
    openDatabase().then((value) => {
      this.db = value;
      this.createTables();
    });
    // this.db = SQLite.openDatabase(DBname);
    // this.createTables();
  }
  createTables() {
    this.db?.transaction((tx) => {
      // tx.executeSql("DROP TABLE Vehicles");
      // tx.executeSql("DROP TABLE Gaurantors");
      // tx.executeSql("DROP TABLE Counts");

      // Gaurantor
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS
          Gaurantors (
            gaurantor_phone TEXT PRIMARY KEY NOT NULL,
            gaurantor_name TEXT
          )`,
        [],
        () => {
          console.info("Created Guarantors");
        },
        (error) => {
          console.error(error);
          return false;
        }
      );

      // Vehicles
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS
          Vehicles (id TEXT PRIMARY KEY NOT NULL,
            vehicle_name TEXT,
            client_name TEXT,
            client_phone TEXT,
            deadline TEXT,
            remain_price TEXT,
            remain_deadline TEXT,
            gaurantor_phone TEXT,
            FOREIGN KEY (gaurantor_phone) REFERENCES Gaurantors (gaurantor_phone)
          )`,
        [],
        () => {
          console.info("Created Vehicles");
        },
        (error) => {
          console.error(error);
          return false;
        }
      );

      // SMS Counts
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS
          Counts (
            count NUMBER,
            vehicle_id TEXT UNIQUE DEFAULT 0,
            FOREIGN KEY (vehicle_id) REFERENCES Vehicles (id) ON DELETE CASCADE
          )`,
        [],
        () => {
          console.info("created Counts");
        },
        (error) => {
          console.error(error);
          return false;
        }
      );
    });
  }

  addGaurantor(gaurantor: Gaurantor) {
    const _addGaurantor = async (tx: SQLite.SQLTransaction) => {
      tx.executeSql(
        `INSERT INTO
          Gaurantors (
            gaurantor_phone,
            gaurantor_name
            ) VALUES (?, ?)`,
        [gaurantor.phone, gaurantor.name],
        () => {},
        (error) => {
          console.error(error);
          return false;
        }
      );
    };
    this.db?.transaction(_addGaurantor);
  }

  addVehicle(vehicle: Vehicle) {
    this.db?.transaction(async (tx) => {
      // Add vehicle
      tx.executeSql(
        `INSERT INTO
          Vehicles (id,
            vehicle_name,
            client_name,
            client_phone,
            deadline,
            remain_price,
            remain_deadline,
            gaurantor_phone
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vehicle.id,
          vehicle.name,
          vehicle?.client?.name,
          vehicle?.client?.phone,
          vehicle.deadline.toLocaleDateString(locale),
          vehicle?.payment.price,
          vehicle?.payment.deadline.toLocaleDateString(locale),
          vehicle?.gaurantor.phone,
        ],
        () => {
          // Add Gaurantor
          if (
            vehicle.gaurantor.name.length > 0 &&
            vehicle.gaurantor.phone.length > 0
          ) {
            this.getGaurantor(
              vehicle.gaurantor.phone,
              (gaurantor: Gaurantor) => {
                if (!gaurantor.name.length && !gaurantor.phone.length) {
                  this.addGaurantor(vehicle.gaurantor);
                }
              }
            );
          }

          // Add SMS count
          this.getCount(vehicle.id, (count: number) => {
            if (count < 0) {
              this.addCount(vehicle.id);
            }
          });
        },
        (error) => {
          console.log(error);
          return true;
        }
      );
    });
  }

  addCount(id: string, count: number = 0) {
    this.db?.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Counts (
                    vehicle_id,
                    count
                ) VALUES (?, ?)`,
        [id, count],
        () => {},
        (error) => {
          console.error(error);
          return false;
        }
      );
    });
  }
  getCount(id: string, callback: Function) {
    this.db?.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Counts WHERE vehicle_id="${id}"`,
        // `SELECT * FROM Counts`,
        [],
        (tx, res) => {
          let count: number = -1;
          if (res.rows.length) {
            const row = res.rows.item(0);
            count = row["count"];
          }
          callback(count);
        }
      );
    });
  }

  getAllVehicles(callback: Function, ispaid = true) {
    try {
      this.db?.transaction((tx) => {
        tx.executeSql(
          `SELECT Vehicles.*, Counts.count FROM Vehicles
          INNER JOIN Counts
          ON Vehicles.id=Counts.vehicle_id
          WHERE remain_price ${ispaid ? "=" : ">"} 0.0`,
          [],
          (tx, res) => {
            let vehicles: Vehicle[] = [];
            for (let i = 0; i < res.rows.length; i++) {
              const row = res.rows.item(i);
              // if (!row.id || typeof row.id !== "string") continue;
              row["deadline"] = new Date(row.deadline);
              vehicles.push({
                id: row["id"],
                name: row["vehicle_name"],
                deadline: row["deadline"],
                client: {
                  name: row["client_name"],
                  phone: row["client_phone"],
                },
                gaurantor: {
                  name: "",
                  phone: row["gaurantor_phone"],
                },
                payment: {
                  deadline: row["remain_deadline"],
                  price: row["remain_price"],
                },
                count: row["count"],
              });
            }
            vehicles = vehicles.sort((a, b) => {
              return a.deadline.getTime() - b.deadline.getTime();
            });
            callback(vehicles);
          },
          (error) => {
            console.error(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  getGaurantor(phone: string, callback?: Function) {
    const _getGaurantor = async (tx: SQLite.SQLTransaction) => {
      tx.executeSql(
        `SELECT * FROM Gaurantors
          WHERE gaurantor_phone="${phone}"`,
        [],
        (tx, res) => {
          let gaurantor: Gaurantor = {
            name: "",
            phone: "",
          };
          if (res.rows.length > 0) {
            const row = res.rows.item(0);
            console.log(row);
            gaurantor = {
              name: row["gaurantor_name"],
              phone: row["gaurantor_phone"],
            };
          }
          if (callback) callback(gaurantor);
        },
        (error) => {
          console.error(error);
          return false;
        }
      );
    };
    try {
      this.db?.transaction(_getGaurantor);
    } catch (error) {
      console.log(error);
    }
  }

  getAllGaurantors(callback: Function) {
    try {
      this.db?.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Gaurantors",
          [],
          (tx, res) => {
            let gaurantors: Gaurantor[] = [];
            if (res.rows.length > 0) {
              for (let i = 0; i < res.rows.length; i++) {
                const row = res.rows.item(i);
                gaurantors.push({
                  name: row["gaurantor_name"],
                  phone: row["gaurantor_phone"],
                } as Gaurantor);
              }
            }
            callback(gaurantors);
          },
          (error) => {
            console.error(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  getVehiclesByClientName(name: string, callback: Function) {
    try {
      this.db?.transaction((tx) => {
        tx.executeSql(
          `SELECT *, Counts.count FROM Vehicles
            INNER JOIN Counts
            ON Vehicles.id=Counts.vehicle_id
            WHERE client_name LIKE "%${name}%" LIMIT 50`,
          [],
          (tx, res) => {
            const vehicles = [];
            for (let i = 0; i < res.rows.length; i++) {
              const row = res.rows.item(i);
              row["deadline"] = new Date(row.deadline);
              vehicles.push({
                id: row["id"],
                name: row["vehicle_name"],
                deadline: row["deadline"],
                client: {
                  name: row["client_name"],
                  phone: row["client_phone"],
                },
                gaurantor: {
                  name: "",
                  phone: row["gaurantor_phone"],
                },
                payment: {
                  deadline: row["remain_deadline"],
                  price: row["remain_price"],
                },
                count: row["count"],
              });
            }
            callback(vehicles);
          },
          (error) => {
            console.error(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  getVehicle(prop: { id: string }, callback: Function) {
    /**
     * Get all vehicle
     *
     * Join Gaurantors table may cause a fatal error, In case the insertion goes not well
     * in the gaurantor insertion. user will not be able to entry to the client details
     * and it will not be able to modify or remove the client.
     * TODO: Fix the describe error above
     */
    try {
      this.db?.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM Vehicles WHERE id="${prop.id}"`,
          [],
          (tx, res) => {
            const row = res.rows.item(0);
            row["deadline"] = new Date(row.deadline);
            row["remain_deadline"] = new Date(row.remain_deadline);
            const vehicle: Vehicle = {
              id: row["id"],
              name: row["vehicle_name"],
              deadline: row["deadline"],
              client: {
                name: row["client_name"],
                phone: row["client_phone"],
              },
              gaurantor: {
                name: "",
                phone: row["gaurantor_phone"],
              },
              payment: {
                deadline: row["remain_deadline"],
                price: row["remain_price"],
              },
            };

            if (vehicle.gaurantor.phone.length) {
              tx.executeSql(
                `SELECT * FROM Gaurantors WHERE gaurantor_phone="${vehicle.gaurantor.phone}"`,
                [],
                (tx, res) => {
                  if (res.rows.length > 0) {
                    const row = res.rows.item(0);
                    vehicle.gaurantor.name = row["gaurantor_name"];
                  }
                  callback(vehicle);
                }
              );
            } else {
              callback(vehicle);
            }
          },
          (error) => {
            console.log(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  getVehiclesByDeadline(date: string, callback: Function) {
    try {
      this.db?.transaction((tx) => {
        tx.executeSql(
          `SELECT Vehicles.*, Counts.count FROM Vehicles
          INNER JOIN Counts
          ON Vehicles.id = Counts.vehicle_id
          WHERE deadline="${date}"`,
          [],
          (tx, res) => {
            const vehicles = [];
            for (let i = 0; i < res.rows.length; i++) {
              const row = res.rows.item(i);
              if (!row.id || typeof row.id !== "string") continue;
              row["deadline"] = new Date(row.deadline);
              vehicles.push(row);
            }
            callback(vehicles);
          },
          (error) => {
            console.error(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  getVehiclesByRemainDeadline(date: string, callback: Function) {
    try {
      this.db?.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM Vehicles WHERE remain_deadline="${date}" AND remain_price > 0`,
          [],
          (tx, res) => {
            const vehicles = [];
            for (let i = 0; i < res.rows.length; i++) {
              const row = res.rows.item(i);
              if (!row.id || typeof row.id !== "string") continue;
              row["deadline"] = new Date(row.deadline);
              row["remain_deadline"] = new Date(row.remain_deadline);
              vehicles.push(row);
            }
            callback(vehicles);
          },
          (error) => {
            console.error(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  updateVehicle(vehicle: Vehicle) {
    try {
      this.db?.transaction((tx) => {
        tx.executeSql(
          `UPDATE Vehicles SET
          vehicle_name="${vehicle.name}",
          client_name="${vehicle.client.name}",
          client_phone="${vehicle.client.phone}",
          deadline="${vehicle.deadline.toLocaleDateString(locale)}",
          remain_price=${vehicle.payment.price},
          remain_deadline="${vehicle.payment.deadline.toLocaleDateString(
            locale
          )}",
          gaurantor_phone="${vehicle.gaurantor.phone}"
          WHERE id="${vehicle.id}"`,
          [],
          () => {},
          (error) => {
            console.error(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  updateCounts(count: Count) {
    try {
      this.db?.transaction((tx) => {
        tx.executeSql(
          `UPDATE Counts SET count=${count.count} WHERE vehicle_id="${count.vehicle_id}"`,
          [],
          () => {},
          (error) => {
            console.error(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  deleteVehicle(id: string, callback?: Function) {
    try {
      this.db?.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM Vehicles WHERE id="${id}"`,
          [],
          () => {
            if (callback) callback();
          },
          (error) => {
            console.error(error);
            return false;
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const Database = (function () {
  var instance: _Database;

  function createInstance() {
    var db = new _Database();
    return db;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

export { Database };
