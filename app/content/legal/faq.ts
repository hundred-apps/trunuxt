import type { FaqDocument, Localized } from "./types";

export const faq: Localized<FaqDocument> = {
  id: {
    title: "FAQ",
    metaDesc:
      "Pertanyaan yang sering diajukan regarding harga, pembelian, pembayaran, pengiriman, garansi, dan retur di Trumecs.com.",
    intro:
      "Berikut pertanyaan yang sering diajukan oleh pelanggan Trumecs. Jika jawaban Anda belum ditemukan, silakan hubungi tim_cs kami melalui WhatsApp atau email.",
    items: [
      {
        q: "Apakah harga yang tercantum di halaman detail produk adalah harga terbaru?",
        a: "Belum tentu. Harga barang dapat berubah dalam sekejap yang dipengaruhi oleh banyak hal. Silakan konfirmasi harga dan stok terbaru kepada tim_cs kami sebelum melakukan pembelian.",
      },
      {
        q: "Apakah saya bisa melakukan pembelian secara langsung melalui Trumecs.com?",
        a: "Saat ini belum. Untuk melakukan pembelian, silakan hubungi admin CS kami melalui WhatsApp atau email. Tim kami akan membantu proses pemesanan Anda.",
      },
      {
        q: "Apakah barang yang saya beli dapat dikembalikan atau dibatalkan jika barang yang saya terima tidak sesuai?",
        a: "Tergantung dengan kesepakatan sebelum melakukan transaksi. Informasi mengenai spesifikasi produk dan ketentuan transaksi akan kami sampaikan melalui SPH (Surat Penawaran Harga). Pastikan spesifikasi produk dan ketentuan transaksi sudah sesuai dengan kesepakatan Anda dengan tim Trumecs.",
      },
      {
        q: "Apakah tersedia produk dalam kondisi baru, rekondisi, atau bekas?",
        a: "Ya. Setiap produk mencantumkan kondisinya, yaitu baru, rekondisi, atau bekas, beserta keterangan grade pada halaman detail produk. Mohon pastikan kondisi yang tercantum sebelum melakukan pembelian.",
      },
      {
        q: "Metode pembayaran apa saja yang tersedia?",
        a: "Pembayaran dapat dilakukan melalui transfer bank ke rekening resmi Trumecs. Untuk produk tertentu kami juga menyediakan pembayaran dengan kartu kredit. Seluruh informasi rekening dan metode pembayaran akan dikonfirmasi oleh tim sales melalui SPH.",
      },
      {
        q: "Berapa lama pesanan saya diproses dan dikirim?",
        a: "Waktu proses bergantung pada ketersediaan stok dan lokasi pengiriman. Untuk produk yang siap stock, proses dapat memakan waktu beberapa hari kerja, sedangkan produk yang perlu pemesanan dari principal memerlukan waktu lebih lama sesuai keterangan pada SPH.",
      },
      {
        q: "Apakah bisa kirim ke seluruh Indonesia?",
        a: "Bisa. Trumecs melayani pengiriman ke seluruh wilayah Indonesia. Ongkir dihitung berdasarkan kurir, berat, dan tujuan pengiriman, dan akan diinformasikan bersama pada SPH.",
      },
      {
        q: "Bagaimana cara melacak status pesanan saya?",
        a: "Nomor resi pengiriman akan kami kirimkan melalui WhatsApp atau email setelah paket diserahkan ke kurir. Anda dapat melacak paket menggunakan nomor resi tersebut pada situs kurir terkait.",
      },
      {
        q: "Apakah produk bergaransi?",
        a: "Garansi mengikuti ketentuan principal atau pabrikan terkait yang tertera pada SPH dan halaman detail produk. Durasi dan cakupan garansi berbeda tiap produk, sehingga pastikan untuk memeriksa keterangan garansi sebelum melakukan pembelian.",
      },
      {
        q: "Apakah harga sudah termasuk pajak?",
        a: "Harga yang tercantum pada halaman produk belum selalu termasuk pajak. Informasi lengkap mengenai pajak akan dihitung dan disampaikan secara rinci melalui SPH agar tidak terjadi selisih pada saat pembayaran.",
      },
      {
        q: "Bagaimana cara memperoleh RFQ atau surat penawaran harga?",
        a: "Anda dapat mengajukan permintaan penawaran melalui tombol Kirim Info Kebutuhan di website, atau langsung menghubungi tim sales kami melalui WhatsApp dan email. kami akan menyiapkan SPH sesuai kebutuhan Anda.",
      },
      {
        q: "Apakah ada biaya tambahan selain harga produk dan ongkir?",
        a: "Biaya tambahan yang mungkin berlaku meliputi pajak, ongkir, serta biaya pemasangan atau instalasi untuk produk tertentu. Seluruh rincian biaya akan disampaikan secara transparan melalui SPH sebelum transaksi terjadi.",
      },
    ],
  },

  en: {
    title: "FAQ",
    metaDesc:
      "Frequently asked questions about pricing, ordering, payment, shipping, warranty and returns at Trumecs.com.",
    intro:
      "Below are the questions most frequently asked by Trumecs customers. If you cannot find your answer here, please contact our team via WhatsApp or email.",
    items: [
      {
        q: "Is the price shown on the product detail page the latest price?",
        a: "Not necessarily. Prices may change at any time due to a number of factors. Please confirm the latest price and stock availability with our team before placing an order.",
      },
      {
        q: "Can I place an order directly through Trumecs.com?",
        a: "Not at the moment. To place an order, please contact our customer service team via WhatsApp or email. Our team will assist you with the ordering process.",
      },
      {
        q: "Can my order be returned or cancelled if the goods I receive do not match?",
        a: "This depends on the agreement made before the transaction. Product specifications and transaction terms will be presented to you through the quotation letter (SPH / Surat Penawaran Harga). Please ensure the specifications and terms match your agreement with Trumecs.",
      },
      {
        q: "Are products available in new, reconditioned or used condition?",
        a: "Yes. Each product lists its condition - new, reconditioned or used - together with a grade description on the product detail page. Please check the stated condition before placing an order.",
      },
      {
        q: "Which payment methods are available?",
        a: "Payment can be made by bank transfer to Trumecs' official account. Credit card payment is also available for certain products. All account details and payment methods will be confirmed by our sales team through the SPH.",
      },
      {
        q: "How long does it take to process and ship my order?",
        a: "Processing time depends on stock availability and the destination. Items that are ready in stock can be dispatched within a few working days, while items that need to be ordered from the principal take longer, as stated in the SPH.",
      },
      {
        q: "Do you deliver across Indonesia?",
        a: "Yes. Trumecs delivers to all regions of Indonesia. Shipping costs are calculated based on the courier, weight and destination, and are stated together in the SPH.",
      },
      {
        q: "How can I track the status of my order?",
        a: "The tracking number will be sent to you via WhatsApp or email once the parcel has been handed over to the courier. You can track your parcel using that number on the courier's website.",
      },
      {
        q: "Do products come with a warranty?",
        a: "Warranty follows the terms of the respective principal or manufacturer as stated in the SPH and on the product detail page. Duration and coverage differ per product, so please check the warranty details before ordering.",
      },
      {
        q: "Do the listed prices include tax?",
        a: "Prices listed on product pages are not always inclusive of tax. The applicable taxes are calculated and presented in detail through the SPH so that there is no discrepancy at the time of payment.",
      },
      {
        q: "How do I request a quotation (RFQ / price offer)?",
        a: "You can submit a request for quotation using the Request Information button on the website, or contact our sales team directly via WhatsApp and email. We will prepare an SPH according to your requirements.",
      },
      {
        q: "Are there any additional fees besides the product price and shipping?",
        a: "Possible additional charges include tax, shipping costs, and installation or setup fees for certain products. All charges are transparently detailed in the SPH before any transaction takes place.",
      },
    ],
  },

  zh: {
    title: "常见问题",
    metaDesc: "Trumecs.com 关于价格、下单、付款、配送、保修与退货的常见问题解答。",
    intro:
      "以下为 Trumecs 客户最常提出的问题。若未能找到您需要的答案，欢迎通过 WhatsApp 或邮件与我们联系。",
    items: [
      {
        q: "产品详情页所标示的价格是否为最新价格？",
        a: "不一定。价格可能因多种因素随时变动。请在购买前向我们的团队确认最新价格与库存情况。",
      },
      {
        q: "我可以通过 Trumecs.com 直接下单购买吗？",
        a: "目前尚不支持。您可通过 WhatsApp 或邮件联系我们的客户服务团队，我们的团队将协助您完成下单流程。",
      },
      {
        q: "如果收到的商品与预期不符，可以退货或取消订单吗？",
        a: "视交易前的约定而定。产品规格及交易条款将通过报价单（SPH / Surat Penawaran Harga）向您说明。请在交易前确认产品规格与交易条款已符合您与 Trumecs 达成的共识。",
      },
      {
        q: "产品是否有全新、翻新或二手的分类？",
        a: "有。每一件产品均会在产品详情页标示其状态（全新、翻新或二手）及等级说明。请在购买前确认所标示的状态。",
      },
      {
        q: "支持哪些付款方式？",
        a: "可通过银行转账至 Trumecs 官方账户付款。特定产品亦支持信用卡付款。所有账户信息与付款方式将由销售团队通过 SPH 予以确认。",
      },
      {
        q: "订单的处理与发货需要多长时间？",
        a: "处理时间取决于库存情况与收货地址。现货商品可在数个工作日内发出；需向供应商订购的商品所需时间较长，具体以 SPH 中的说明为准。",
      },
      {
        q: "是否可以配送至印尼全境？",
        a: "可以。Trumecs 提供全印尼范围的配送服务。运费依据承运商、重量与收货地址计算，并会于 SPH 中一并说明。",
      },
      {
        q: "如何查询订单物流状态？",
        a: "包裹交付承运商后，我们会通过 WhatsApp 或邮件将运单号发送给您。您可凭该运单号于相应承运商网站查询物流进度。",
      },
      {
        q: "产品是否有保修？",
        a: "保修依各供应商或制造商的规定执行，具体内容载于 SPH 及产品详情页。保修期限与范围因产品而异，请在购买前确认保修条款。",
      },
      {
        q: "所标示的价格是否已含税？",
        a: "产品页面所标示的价格未必已包含税费。适用税费将通过 SPH 详细列明，以确保付款时不会产生差额。",
      },
      {
        q: "如何申请报价（RFQ / 索取价格单）？",
        a: "您可通过网站上的「Kirim Info Kebutuhan（提交需求）」按钮提交报价申请，或直接通过 WhatsApp 与邮件联系销售团队。我们将根据您的需求准备 SPH。",
      },
      {
        q: "除产品价格与运费外是否还有其他费用？",
        a: "可能产生的额外费用包括税费、运费，以及特定产品的安装或调试费用。所有费用均会在交易发生前通过 SPH 透明列明。",
      },
    ],
  },
};
