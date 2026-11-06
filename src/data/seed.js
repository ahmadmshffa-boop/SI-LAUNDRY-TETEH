export const STATUSES = ['Menunggu', 'Dicuci', 'Dikeringkan', 'Disetrika', 'Siap Diambil', 'Selesai/Diserahkan'];
export const initialCustomers = [
 {id:1,name:'Nadia Putri',phone:'081298761234',address:'Jl. Melati No. 18, Jakarta Selatan'},
 {id:2,name:'Rizky Pratama',phone:'081377665544',address:'Jl. Cendana No. 4, Jakarta Selatan'},
 {id:3,name:'Dewi Anggraini',phone:'085612340987',address:'Jl. Kemang Raya No. 21, Jakarta Selatan'},
 {id:4,name:'Fajar Ramadhan',phone:'082112223333',address:'Jl. Wijaya Kusuma No. 9, Jakarta Selatan'},
 {id:5,name:'Siti Rahma',phone:'081900112233',address:'Jl. Mampang Prapatan, Jakarta Selatan'}
];
export const initialServices = [
 {id:1,name:'Cuci Kering',unit:'kg',price:7000,durationHours:48,active:true},
 {id:2,name:'Cuci Setrika',unit:'kg',price:10000,durationHours:72,active:true},
 {id:3,name:'Setrika Saja',unit:'kg',price:6000,durationHours:24,active:true},
 {id:4,name:'Bed Cover',unit:'item',price:25000,durationHours:72,active:true}
];
const now = new Date();
const ago = (days)=>new Date(now.getTime()-days*86400000).toISOString();
const future = (hours)=>new Date(now.getTime()+hours*3600000).toISOString();
export const initialTransactions = [
 {id:1,code:'LDR-20261011-001',customerId:1,serviceId:2,quantity:4.5,unitPrice:10000,total:45000,createdAt:ago(0),estimatedAt:future(20),status:'Disetrika',paymentStatus:'Lunas',paymentMethod:'QRIS',statusHistory:[{status:'Menunggu',at:ago(0),note:'Cucian diterima'},{status:'Dicuci',at:ago(0),note:'Mulai proses pencucian'},{status:'Dikeringkan',at:ago(0),note:'Selesai dicuci'},{status:'Disetrika',at:ago(0),note:'Sedang disetrika'}]},
 {id:2,code:'LDR-20261011-002',customerId:2,serviceId:1,quantity:3,unitPrice:7000,total:21000,createdAt:ago(0),estimatedAt:future(30),status:'Dicuci',paymentStatus:'Belum Bayar',paymentMethod:'Tunai',statusHistory:[{status:'Menunggu',at:ago(0),note:'Cucian diterima'},{status:'Dicuci',at:ago(0),note:'Mulai proses pencucian'}]},
 {id:3,code:'LDR-20261010-003',customerId:3,serviceId:2,quantity:6,unitPrice:10000,total:60000,createdAt:ago(1),estimatedAt:future(4),status:'Siap Diambil',paymentStatus:'Lunas',paymentMethod:'Transfer',statusHistory:[{status:'Menunggu',at:ago(1),note:'Cucian diterima'},{status:'Dicuci',at:ago(1),note:'Mulai dicuci'},{status:'Dikeringkan',at:ago(1),note:'Proses pengeringan'},{status:'Disetrika',at:ago(1),note:'Proses setrika'},{status:'Siap Diambil',at:ago(0),note:'Quality check selesai'}]},
 {id:4,code:'LDR-20261009-004',customerId:4,serviceId:3,quantity:2.5,unitPrice:6000,total:15000,createdAt:ago(2),estimatedAt:ago(1),status:'Selesai/Diserahkan',paymentStatus:'Lunas',paymentMethod:'Tunai',statusHistory:[{status:'Menunggu',at:ago(2),note:'Cucian diterima'},{status:'Selesai/Diserahkan',at:ago(1),note:'Pesanan diserahkan'}]},
 {id:5,code:'LDR-20261011-005',customerId:5,serviceId:1,quantity:5,unitPrice:7000,total:35000,createdAt:ago(0),estimatedAt:future(42),status:'Menunggu',paymentStatus:'DP',paymentMethod:'Transfer',statusHistory:[{status:'Menunggu',at:ago(0),note:'Cucian diterima'}]}
];
