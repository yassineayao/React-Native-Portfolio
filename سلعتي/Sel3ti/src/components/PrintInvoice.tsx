/**
 * File: PrintInvoice.js
 * Description: Create, format and render a printable invoice and keep it ready to print.
 * 							The print process is started when the user click on the item.
 */
import React from "react";
import { ListItem } from "react-native-elements";

import * as Print from "expo-print";

import { TouchableOpacity } from "react-native";
import i18n from "../locales/i18n";
import { TInvoice } from "../types";

const PrintInvoice = (prop: { data: TInvoice }) => {
  function generateInvoice(props: TInvoice, total: number) {
    /**
     * Description: Format the invoice using the info passed as args.
     * Args:
     * 			props: contains the orders, client and distributor information.
     * 			total: the invocie total
     * Return: formated HTML string
     */
    return `
			<!DOCTYPE html>
			<html lang="ar">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />

					<!-- Favicon -->
					<link rel="icon" href="./images/favicon.png" type="image/x-icon" />

					<!-- Invoice styling -->
					<style>
						body {
							font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
							text-align: center;
							color: #777;
						}

						body h1 {
							font-weight: 300;
							margin-bottom: 0px;
							padding-bottom: 0px;
							color: #000;
						}

						body h3 {
							font-weight: 300;
							margin-top: 10px;
							margin-bottom: 20px;
							font-style: italic;
							color: #555;
						}

						body a {
							color: #06f;
						}

						.invoice-box {
							width: 90%;
							margin: auto;
							padding: 30px;
							border: 1px solid #eee;
							box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
							font-size: 16px;
							line-height: 24px;
							font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
							color: #555;
						}

						.invoice-box table {
							width: 100%;
							line-height: inherit;
							text-align: left;
							border-collapse: collapse;
						}

						.invoice-box table td {
							padding: 5px;
							vertical-align: top;
						}

						.invoice-box table tr td:nth-child(2) {
							text-align: right;
						}

						.invoice-box table tr.top table td {
							padding-bottom: 20px;
						}

						.invoice-box table tr.top table td.title {
							font-size: 45px;
							line-height: 45px;
							color: #333;
						}

						.invoice-box table tr.information table td {
							padding-bottom: 40px;
						}

						.invoice-box table tr.heading td {
							background: #eee;
							border-bottom: 1px solid #ddd;
							font-weight: bold;
						}

						.invoice-box table tr.details td {
							padding-bottom: 20px;
						}

						.invoice-box table tr.item td {
							border-bottom: 1px solid #eee;
						}

						.invoice-box table tr.item.last td {
							border-bottom: none;
						}

						.invoice-box table tr.total td:nth-child(2) {
							border-top: 2px solid #eee;
							font-weight: bold;
						}

						@media only screen and (max-width: 600px) {
							.invoice-box table tr.top table td {
								width: 100%;
								display: block;
								text-align: center;
							}

							.invoice-box table tr.information table td {
								width: 100%;
								display: block;
								text-align: center;
							}
						}
					</style>
				</head>

				<body>
					<div class="invoice-box">
						<table>
							<tr class="top">
								<td colspan="4">
									<table>
										<tr>
											// TODO: Company logo
											<td class="title">
												<img src="./images/logo.png" alt="${i18n.t(
                          "exportpdf_template_company_logo_alt"
                        )}" style="width: 100%; max-width: 300px" />
											</td>

											<td>
												${i18n.t("exportpdf_template_invoice_id")} #: ${props?.id}<br />
												${i18n.t("exportpdf_template_created")}: ${props?.date}<br />
											</td>
										</tr>
									</table>
								</td>
							</tr>

							<tr class="information">
								<td colspan="4">
									<table>
										<tr>
											<td>
												${props?.distributor?.name}<br />
												${props?.distributor?.phone}<br />
												${props?.distributor?.address}<br />
											</td>
											<td>
												${props?.client?.name}<br />
												${props?.client?.phone}<br />
											</td>
										</tr>
									</table>
								</td>
							</tr>

							<tr class="heading">
								<td>${i18n.t("exportpdf_template_head_item")}</td>
								<td>${i18n.t("exportpdf_template_head_quantity")}</td>
								<td>${i18n.t("exportpdf_template_head_price")}</td>
							</tr>

							${props?.order.map((order) => {
                return `
										<tr class="item">
											<td>${order.product?.name}</td>
											<td>${order?.quantity}</td>
											<td>${i18n.t("currency")} ${parseFloat(order?.price).toFixed(2)}</td>
										</tr>
									`;
              })}

							<tr class="total">
								<td></td>
								<td>
									<table>
										<td style="display:flex;flex-direction:column">
											<span style="color:green">${i18n.t("currency")} ${total.toFixed(2)}</span>
										</td>
										<td>:${i18n.t("exportpdf_template_foot_total")}</td>
									</table>
								</td>
							</tr >
						</table >
					</div >
				</body >
			</html >
			`;
  }

  const printPDF = async (content: string) => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html: content,
    });
  };

  const date = new Date().toString().substring(0, 24);
  // Compute the invoice total
  let total = 0;
  for (const item of prop.data.order) {
    total += parseFloat(item.price);
  }
  return (
    <TouchableOpacity
      className="bg-white shadow-md shadow-black rounded-xl m-1 overflow-hidden"
      onPress={() => printPDF(generateInvoice(prop.data, total))}
    >
      <ListItem
        className="justify-center"
        tvParallaxProperties={undefined}
        hasTVPreferredFocus={undefined}
      >
        <ListItem.Content>
          <ListItem.Title>
            {prop.data.distributor.name} {prop.data.date.toString()}
          </ListItem.Title>
          <ListItem.Subtitle>
            {i18n.t("currency")} {total.toFixed(2)}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
};

export default PrintInvoice;
