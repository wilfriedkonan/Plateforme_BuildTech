import { jsPDF } from 'jspdf';
import * as jspdfAutoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Extension du type jsPDF pour inclure autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ReportData {
  sales: Array<{
    date: string;
    product: string;
    quantity: number;
    unitPrice: number;
    total: number;
    customer: string;
  }>;
  customers: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    totalPurchases: number;
    lastPurchase: string;
    status: 'active' | 'inactive';
  }>;
  inventory: Array<{
    id: string;
    name: string;
    category: string;
    stock: number;
    minStock: number;
    price: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
  }>;
  financial: {
    revenue: number;
    expenses: number;
    profit: number;
    taxes: number;
    breakdown: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
  };
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  type: 'sales' | 'customers' | 'inventory' | 'financial';
}

// Génération de données simulées
export const generateMockData = (filters: ReportFilters): ReportData => {
  const startDate = new Date(filters.startDate);
  const endDate = new Date(filters.endDate);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

  // Données de ventes simulées
  const sales = Array.from({ length: Math.min(daysDiff * 3, 100) }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(i / 3));
    
    const products = ['T-shirt', 'Pantalon', 'Robe', 'Chaussures', 'Accessoires', 'Veste'];
    const customers = ['Marie Dupont', 'Jean Martin', 'Sophie Bernard', 'Pierre Durand', 'Claire Moreau'];
    
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const unitPrice = Math.floor(Math.random() * 80) + 20;
    
    return {
      date: date.toLocaleDateString('fr-FR'),
      product,
      quantity,
      unitPrice,
      total: quantity * unitPrice,
      customer: customers[Math.floor(Math.random() * customers.length)]
    };
  });

  // Données clients simulées
  const customers = Array.from({ length: 50 }, (_, i) => {
    const names = ['Marie Dupont', 'Jean Martin', 'Sophie Bernard', 'Pierre Durand', 'Claire Moreau', 
                   'Antoine Petit', 'Isabelle Roux', 'François Blanc', 'Nathalie Girard', 'Thomas Morel'];
    const name = names[i % names.length] + ` ${i + 1}`;
    
    return {
      id: `CUST${String(i + 1).padStart(4, '0')}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      phone: `+33 6 ${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      totalPurchases: Math.floor(Math.random() * 2000) + 100,
      lastPurchase: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      status: Math.random() > 0.2 ? 'active' as const : 'inactive' as const
    };
  });

  // Données inventaire simulées
  const inventory = Array.from({ length: 30 }, (_, i) => {
    const products = ['T-shirt Blanc', 'Jean Slim', 'Robe Été', 'Baskets Sport', 'Sac à Main', 
                     'Veste Cuir', 'Pull Laine', 'Chemise Coton', 'Pantalon Chino', 'Écharpe Soie'];
    const categories = ['Vêtements', 'Chaussures', 'Accessoires'];
    
    const stock = Math.floor(Math.random() * 100);
    const minStock = 10;
    
    return {
      id: `PROD${String(i + 1).padStart(4, '0')}`,
      name: products[i % products.length],
      category: categories[Math.floor(Math.random() * categories.length)],
      stock,
      minStock,
      price: Math.floor(Math.random() * 150) + 25,
      status: stock === 0 ? 'out_of_stock' as const : 
              stock <= minStock ? 'low_stock' as const : 'in_stock' as const
    };
  });

  // Données financières simulées
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const expenses = totalRevenue * 0.6;
  const profit = totalRevenue - expenses;
  const taxes = profit * 0.2;

  const financial = {
    revenue: totalRevenue,
    expenses,
    profit,
    taxes,
    breakdown: [
      { category: 'Ventes', amount: totalRevenue, percentage: 100 },
      { category: 'Coût des marchandises', amount: expenses * 0.7, percentage: 42 },
      { category: 'Frais généraux', amount: expenses * 0.2, percentage: 12 },
      { category: 'Marketing', amount: expenses * 0.1, percentage: 6 }
    ]
  };

  return { sales, customers, inventory, financial };
};

// Génération PDF
export const generatePDFReport = (data: ReportData, filters: ReportFilters, companyName: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // En-tête
  doc.setFontSize(20);
  doc.setTextColor(139, 92, 246); // Purple
  doc.text(companyName, 20, 25);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Rapport ${getReportTypeLabel(filters.type)}`, 20, 40);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Période: ${filters.startDate} au ${filters.endDate}`, 20, 50);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 60);
  
  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 70, pageWidth - 20, 70);

  let yPosition = 85;

  switch (filters.type) {
    case 'sales':
      // Résumé des ventes
      const totalSales = data.sales.reduce((sum, sale) => sum + sale.total, 0);
      const totalQuantity = data.sales.reduce((sum, sale) => sum + sale.quantity, 0);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Résumé des ventes', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(12);
      doc.text(`Total des ventes: ${totalSales.toLocaleString('fr-FR')} €`, 20, yPosition);
      doc.text(`Nombre d'articles vendus: ${totalQuantity}`, 20, yPosition + 10);
      doc.text(`Nombre de transactions: ${data.sales.length}`, 20, yPosition + 20);
      yPosition += 40;
      
      // Tableau des ventes
      doc.autoTable({
        startY: yPosition,
        head: [['Date', 'Produit', 'Quantité', 'Prix unitaire', 'Total', 'Client']],
        body: data.sales.map(sale => [
          sale.date,
          sale.product,
          sale.quantity.toString(),
          `${sale.unitPrice} €`,
          `${sale.total} €`,
          sale.customer
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [139, 92, 246] }
      });
      break;

    case 'customers':
      // Résumé clients
      const activeCustomers = data.customers.filter(c => c.status === 'active').length;
      const totalCustomerValue = data.customers.reduce((sum, c) => sum + c.totalPurchases, 0);
      
      doc.setFontSize(14);
      doc.text('Résumé de la clientèle', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(12);
      doc.text(`Total clients: ${data.customers.length}`, 20, yPosition);
      doc.text(`Clients actifs: ${activeCustomers}`, 20, yPosition + 10);
      doc.text(`Valeur totale: ${totalCustomerValue.toLocaleString('fr-FR')} €`, 20, yPosition + 20);
      yPosition += 40;
      
      // Tableau clients
      doc.autoTable({
        startY: yPosition,
        head: [['ID', 'Nom', 'Email', 'Téléphone', 'Achats totaux', 'Statut']],
        body: data.customers.map(customer => [
          customer.id,
          customer.name,
          customer.email,
          customer.phone,
          `${customer.totalPurchases} €`,
          customer.status === 'active' ? 'Actif' : 'Inactif'
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [139, 92, 246] }
      });
      break;

    case 'inventory':
      // Résumé inventaire
      const inStock = data.inventory.filter(i => i.status === 'in_stock').length;
      const lowStock = data.inventory.filter(i => i.status === 'low_stock').length;
      const outOfStock = data.inventory.filter(i => i.status === 'out_of_stock').length;
      
      doc.setFontSize(14);
      doc.text('Résumé de l\'inventaire', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(12);
      doc.text(`Total produits: ${data.inventory.length}`, 20, yPosition);
      doc.text(`En stock: ${inStock}`, 20, yPosition + 10);
      doc.text(`Stock faible: ${lowStock}`, 20, yPosition + 20);
      doc.text(`Rupture de stock: ${outOfStock}`, 20, yPosition + 30);
      yPosition += 50;
      
      // Tableau inventaire
      doc.autoTable({
        startY: yPosition,
        head: [['ID', 'Produit', 'Catégorie', 'Stock', 'Stock min', 'Prix', 'Statut']],
        body: data.inventory.map(item => [
          item.id,
          item.name,
          item.category,
          item.stock.toString(),
          item.minStock.toString(),
          `${item.price} €`,
          getStatusLabel(item.status)
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [139, 92, 246] }
      });
      break;

    case 'financial':
      // Résumé financier
      doc.setFontSize(14);
      doc.text('Résumé financier', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(12);
      doc.text(`Chiffre d'affaires: ${data.financial.revenue.toLocaleString('fr-FR')} €`, 20, yPosition);
      doc.text(`Dépenses: ${data.financial.expenses.toLocaleString('fr-FR')} €`, 20, yPosition + 10);
      doc.text(`Bénéfice: ${data.financial.profit.toLocaleString('fr-FR')} €`, 20, yPosition + 20);
      doc.text(`Impôts: ${data.financial.taxes.toLocaleString('fr-FR')} €`, 20, yPosition + 30);
      yPosition += 50;
      
      // Tableau répartition
      doc.autoTable({
        startY: yPosition,
        head: [['Catégorie', 'Montant', 'Pourcentage']],
        body: data.financial.breakdown.map(item => [
          item.category,
          `${item.amount.toLocaleString('fr-FR')} €`,
          `${item.percentage}%`
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [139, 92, 246] }
      });
      break;
  }

  // Pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} sur ${pageCount}`, pageWidth - 40, doc.internal.pageSize.height - 10);
    doc.text(`${companyName} - Rapport confidentiel`, 20, doc.internal.pageSize.height - 10);
  }

  // Sauvegarde
  const fileName = `rapport_${filters.type}_${filters.startDate}_${filters.endDate}.pdf`;
  doc.save(fileName);
};

// Génération Excel
export const generateExcelReport = (data: ReportData, filters: ReportFilters, companyName: string) => {
  const workbook = XLSX.utils.book_new();

  // Feuille de résumé
  const summaryData = [
    ['RAPPORT D\'ACTIVITÉ'],
    [''],
    ['Entreprise:', companyName],
    ['Type de rapport:', getReportTypeLabel(filters.type)],
    ['Période:', `${filters.startDate} au ${filters.endDate}`],
    ['Date de génération:', new Date().toLocaleDateString('fr-FR')],
    ['']
  ];

  switch (filters.type) {
    case 'sales':
      const totalSales = data.sales.reduce((sum, sale) => sum + sale.total, 0);
      const totalQuantity = data.sales.reduce((sum, sale) => sum + sale.quantity, 0);
      
      summaryData.push(
        ['RÉSUMÉ DES VENTES'],
        ['Total des ventes:', `${totalSales.toLocaleString('fr-FR')} €`],
        ['Nombre d\'articles vendus:', totalQuantity],
        ['Nombre de transactions:', data.sales.length],
        ['']
      );

      // Feuille des ventes détaillées
      const salesSheet = [
        ['Date', 'Produit', 'Quantité', 'Prix unitaire', 'Total', 'Client'],
        ...data.sales.map(sale => [
          sale.date,
          sale.product,
          sale.quantity,
          sale.unitPrice,
          sale.total,
          sale.customer
        ])
      ];
      
      const salesWorksheet = XLSX.utils.aoa_to_sheet(salesSheet);
      XLSX.utils.book_append_sheet(workbook, salesWorksheet, 'Ventes détaillées');
      break;

    case 'customers':
      const activeCustomers = data.customers.filter(c => c.status === 'active').length;
      const totalCustomerValue = data.customers.reduce((sum, c) => sum + c.totalPurchases, 0);
      
      summaryData.push(
        ['RÉSUMÉ DE LA CLIENTÈLE'],
        ['Total clients:', data.customers.length],
        ['Clients actifs:', activeCustomers],
        ['Valeur totale:', `${totalCustomerValue.toLocaleString('fr-FR')} €`],
        ['']
      );

      // Feuille des clients
      const customersSheet = [
        ['ID', 'Nom', 'Email', 'Téléphone', 'Achats totaux', 'Dernier achat', 'Statut'],
        ...data.customers.map(customer => [
          customer.id,
          customer.name,
          customer.email,
          customer.phone,
          customer.totalPurchases,
          customer.lastPurchase,
          customer.status === 'active' ? 'Actif' : 'Inactif'
        ])
      ];
      
      const customersWorksheet = XLSX.utils.aoa_to_sheet(customersSheet);
      XLSX.utils.book_append_sheet(workbook, customersWorksheet, 'Clients');
      break;

    case 'inventory':
      const inStock = data.inventory.filter(i => i.status === 'in_stock').length;
      const lowStock = data.inventory.filter(i => i.status === 'low_stock').length;
      const outOfStock = data.inventory.filter(i => i.status === 'out_of_stock').length;
      
      summaryData.push(
        ['RÉSUMÉ DE L\'INVENTAIRE'],
        ['Total produits:', data.inventory.length],
        ['En stock:', inStock],
        ['Stock faible:', lowStock],
        ['Rupture de stock:', outOfStock],
        ['']
      );

      // Feuille inventaire
      const inventorySheet = [
        ['ID', 'Produit', 'Catégorie', 'Stock', 'Stock minimum', 'Prix', 'Statut'],
        ...data.inventory.map(item => [
          item.id,
          item.name,
          item.category,
          item.stock,
          item.minStock,
          item.price,
          getStatusLabel(item.status)
        ])
      ];
      
      const inventoryWorksheet = XLSX.utils.aoa_to_sheet(inventorySheet);
      XLSX.utils.book_append_sheet(workbook, inventoryWorksheet, 'Inventaire');
      break;

    case 'financial':
      summaryData.push(
        ['RÉSUMÉ FINANCIER'],
        ['Chiffre d\'affaires:', `${data.financial.revenue.toLocaleString('fr-FR')} €`],
        ['Dépenses:', `${data.financial.expenses.toLocaleString('fr-FR')} €`],
        ['Bénéfice:', `${data.financial.profit.toLocaleString('fr-FR')} €`],
        ['Impôts:', `${data.financial.taxes.toLocaleString('fr-FR')} €`],
        ['']
      );

      // Feuille répartition financière
      const financialSheet = [
        ['Catégorie', 'Montant', 'Pourcentage'],
        ...data.financial.breakdown.map(item => [
          item.category,
          item.amount,
          `${item.percentage}%`
        ])
      ];
      
      const financialWorksheet = XLSX.utils.aoa_to_sheet(financialSheet);
      XLSX.utils.book_append_sheet(workbook, financialWorksheet, 'Répartition financière');
      break;
  }

  // Feuille de résumé
  const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Résumé');

  // Sauvegarde
  const fileName = `rapport_${filters.type}_${filters.startDate}_${filters.endDate}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Fonctions utilitaires
const getReportTypeLabel = (type: string): string => {
  switch (type) {
    case 'sales': return 'des Ventes';
    case 'customers': return 'de la Clientèle';
    case 'inventory': return 'de l\'Inventaire';
    case 'financial': return 'Financier';
    default: return 'Général';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'in_stock': return 'En stock';
    case 'low_stock': return 'Stock faible';
    case 'out_of_stock': return 'Rupture';
    default: return status;
  }
};