import React from "react"
import * as Print from "expo-print"
import * as Sharing from "expo-sharing"
import { Button } from "react-native-paper"
import Colors from "../constants/Colors"

export default function GenerateReport({ title, source = [] }) {
  async function execute() {
    let htmlData = ""
    source.forEach((item) => {
      htmlData += `<tr>
          <td style='white-space: nowrap'>${item.serviceName}</td>
          <td style='white-space: nowrap'>${item.costumer}</td>
          <td style='white-space: nowrap'>${item.price}</td>
          <td>${item.description}</td>
          <td style='white-space: nowrap'>${new Date(
            item.createdAt?.seconds * 1000,
          ).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}</td>
          <td style='white-space: nowrap'>${item.status}</td>
        </tr>`
    })
    const html = `
      <style>
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
          font-size: 12px;
        }
        
        tr:nth-child(even) {
          background-color: #dddddd;
        }
      </style>

      <div style='width: 100%'> 
        <h3 style='margin-bottom: 5px'>Smart Elektro</h3>
        <small>${title}</small>
        <hr>
        <table style='border-collapse: collapse; width: 100%; margin-top: 20px'>
          <tr>
            <th>Jenis</th>
            <th>Nama</th>
            <th>Harga</th>
            <th>Deskripsi</th>
            <th>Tanggal</th>
            <th>Status</th>
          </tr>
          ${htmlData}
        </table>
      </div>
    `
    const { uri } = await Print.printToFileAsync({
      html,
      margins: {
        top: 10,
        left: 12,
        right: 12,
        bottom: 10,
      },
    })
    Sharing.shareAsync(uri)
  }

  return (
    <Button
      mode="contained"
      style={{ borderRadius: 5 }}
      onPress={() => execute()}
      buttonColor={Colors.dark.primary}
      icon="download"
    >
      Download / Kirim
    </Button>
  )
}
