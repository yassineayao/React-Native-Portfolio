import json
import random
import main.models as models
from faker import Faker
import faker_commerce  # To generate products names

# fake = Faker(['ar_AA'])
# fake.add_provider(faker_commerce.Provider)

# # create distributors
# print('Creating distributors....')
# distributors = []
# for _ in range(1):
#   user = models.User()
#   email = fake.unique.email()
#   user.create_user(
#       username=fake.unique.name_male(),
#       phone=email,
#       password=email,
#       is_distributor=True
#   )
#   distributor = models.Distributor(
#       user=user,
#       email=email,
#       address='Address',
#       region=fake.unique.country()
#   )
#   distributors.append(distributor)
# models.Distributor.objects.bulk_create(distributors)
# print(distributors)

# # create client
# print('Creating clients....')
# clients = []
# for _ in range(100):
#   user = models.User()
#   phone = fake.unique.phone_number()
#   user.create_user(
#       username=fake.unique.name_male(),
#       phone=phone,
#       password='yassine90',
#       is_client=True,
#   )
#   client = models.Client(
#       user=user,
#       phone=phone,
#       address='address',
#       city='city',
#       geo_location='{}',
#   )
#   clients.append(client)
# models.Client.objects.bulk_create(clients)
# print(clients)

# # create products
# print('Creating products....')
# products = []
# for _ in range(100):
#   image = fake.image_url()
#   product = models.Product(
#       key=fake.unique.building_number(),
#       name=fake.ecommerce_name(),
#       image=image
#   )
#   product.save()
#   products.append(product)
# print(products)

# # Create Categories
# print('Creating Categories')
# categories = []
# names = ['atay', 'alban', 'samak', 'dgig',
#          'skar', 'tid', 'mska', 'fanid', 'bimo']
# for name in names:
#   category = models.Category(
#       name=name,
#       image=fake.image_url()
#   )
#   category.save()
#   categories.append(category)


# # create ProductState
# print('Creating productStates....')
# units = ['kg', '10kg', '50kg', '100kg']
# productStates = []
# for category in categories:
#   for _ in range(10):
#     prices = {}
#     for unit in units:
#       prices[unit] = random.randrange(1, 30)

#     productState = models.ProductState(
#         distributor=random.choice(distributors),
#         product=random.choice(products),
#         category=category,
#         prices=json.dumps(prices)
#     )
#     productStates.append(productState)
# models.ProductState.objects.bulk_create(productStates)
# print(productStates)

user = models.User()
phone = "0600775883"
user.create_user(
    username="Abderrahman",
    phone=phone,
    password=phone,
    is_client=True,
)
client = models.Client(
    user=user,
    phone=phone,
    address="address",
    city="city",
    geo_location="{}",
).save()
