const escpos = require('escpos');
const path = require('path');
// install escpos-usb adapter module manually
escpos.USB = require('escpos-usb');
// Select the adapter based on your printer type
const device = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const data = require('./salinan1.json');
const options = { encoding: 'GB18030'};

const printer = new escpos.Printer(device);

const logo = path.join(__dirname, 'logo/mono-ez.png');
let item = data.totalItem;

escpos.Image.load(logo, function (image) {
  device.open(function () {
    printer
    .font('a')
    .size(0,0)
    .align('ct')
    .image(image, 'D24')

      .then(() => {
        printer
          .font('B')
          .style('NORMAL')
          .align('ct')
          .size(2,2)
          .text('Perum, Jl. Sawitsari Jl.Bunga No.5-6, Pikgondeng, Condongcatur, Kec. Depok, Kab. Sleman, D.I.Yogyakarta (55281)');
        printer
          .font('A')
          .style('NORMAL')
          .size(0,0)
          .text('--------------------------------')
          .align('lt')
          .text(
            'Tanggal  : ' +
              new Date().toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
          )
          .text(
            'Jam      : ' +
              new Date().toLocaleString('id-ID', {
                hour: 'numeric',
                minute: 'numeric',
              })
          )
          .text('Order ID : ' + data.orderID)
          .text('--------------------------------');
          for (let i = 0; i <item; i++) {
            printer
              .text(data.produkList[i].merk+'-'+data.produkList[i].nama)
              .tableCustom([
                { text: data.produkList[i].qty+'x', align: 'LEFT', width: 0.1 },
                { text: '@'+data.produkList[i].harga, align: 'RIGHT', width: 0.3 },
                { text: data.produkList[i].hargaTotal, align: 'RIGHT', width: 0.3 }
              ]);
          }
          printer
            .text('--------------------------------')
            .tableCustom([
              { text: 'Sub Total', align: 'LEFT', width: 0.3 },
              { text: 'Rp', align: 'RIGHT', width: 0.1 },
              { text: data.subTotalPrice, align: 'RIGHT', width: 0.3 }
            ])
            .tableCustom([
              { text: 'Biaya Admin', align: 'LEFT', width: 0.3 },
              { text: 'Rp', align: 'RIGHT', width: 0.1 },
              { text: data.adminPrice, align: 'RIGHT', width: 0.3 }
            ])
            .text('--------------------------------')
            .font('A')
            .style('B')
            .size(0,1)
            .tableCustom([
              { text: 'Grand Total', align: 'LEFT', width: 0.3 },
              { text: 'Rp', align: 'RIGHT', width: 0.1 },
              { text: data.orderTotalPrice, align: 'RIGHT', width: 0.3 }
            ]);
        printer
          .font('A')
          .style('NORMAL')
          .size(0,0)
          .tableCustom([
            { text: data.pembayaran, align: 'LEFT', width: 0.3 },
            { text: 'Rp', align: 'RIGHT', width: 0.1 },
            { text: data.pembayaranPrice, align: 'RIGHT', width: 0.3 }
          ])
          .text('--------------------------------')
          .align('ct')
          .text('TERIMA KASIH')
        printer.cut().close();
      });
    });
 });