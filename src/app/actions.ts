'use server';

import { getGoogleSheet } from '@/lib/googleSheets';
import { revalidatePath } from 'next/cache';

export async function togglePantryItemStatus(rowNumber: number, currentStatus: string) {
  const doc = await getGoogleSheet();
  const sheet = doc.sheetsByTitle['Pantry'];
  const rows = await sheet.getRows();
  
  const row = rows.find((r) => r.rowNumber === rowNumber);
  if (row) {
    const newStatus = currentStatus === 'Running Low' ? 'In Stock' : 'Running Low';
    row.assign({ status: newStatus, lastUpdatedBy: 'App User' });
    await row.save();
    
    // Log activity
    const activitySheet = doc.sheetsByTitle['Activity'];
    await activitySheet.addRow({
      id: Date.now().toString(),
      user: 'App User',
      action: `Marked ${row.get('name')} as ${newStatus}`,
      timestamp: new Date().toISOString()
    });

    revalidatePath('/pantry');
    revalidatePath('/shopping');
    revalidatePath('/');
  }
}

export async function addBill(formData: FormData) {
  const doc = await getGoogleSheet();
  const sheet = doc.sheetsByTitle['Finances'];
  
  await sheet.addRow({
    id: Date.now().toString(),
    name: formData.get('name') as string,
    amount: formData.get('amount') as string,
    dueDate: formData.get('dueDate') as string,
    status: formData.get('status') as string,
    lastUpdatedBy: 'App User'
  });

  const activitySheet = doc.sheetsByTitle['Activity'];
  await activitySheet.addRow({
    id: Date.now().toString(),
    user: 'App User',
    action: `Added bill ${formData.get('name') as string}`,
    timestamp: new Date().toISOString()
  });

  revalidatePath('/bills');
  revalidatePath('/');
}

export async function addPantryItem(formData: FormData) {
  const doc = await getGoogleSheet();
  const sheet = doc.sheetsByTitle['Pantry'];
  
  await sheet.addRow({
    id: Date.now().toString(),
    name: formData.get('name') as string,
    category: formData.get('category') as string,
    status: formData.get('status') as string,
    lastUpdatedBy: 'App User'
  });

  const activitySheet = doc.sheetsByTitle['Activity'];
  await activitySheet.addRow({
    id: Date.now().toString(),
    user: 'App User',
    action: `Added pantry item ${formData.get('name') as string}`,
    timestamp: new Date().toISOString()
  });

  revalidatePath('/pantry');
  revalidatePath('/shopping');
  revalidatePath('/');
}

export async function markBillAsPaid(rowNumber: number) {
  const doc = await getGoogleSheet();
  const sheet = doc.sheetsByTitle['Finances'];
  const rows = await sheet.getRows();
  
  const row = rows.find((r) => r.rowNumber === rowNumber);
  if (row) {
    row.assign({ status: 'PAID', lastUpdatedBy: 'App User' });
    await row.save();
    
    const activitySheet = doc.sheetsByTitle['Activity'];
    await activitySheet.addRow({
      id: Date.now().toString(),
      user: 'App User',
      action: `Marked bill ${row.get('name')} as PAID`,
      timestamp: new Date().toISOString()
    });

    revalidatePath('/bills');
    revalidatePath('/');
  }
}

export async function markMaintenanceComplete(rowNumber: number) {
  const doc = await getGoogleSheet();
  const sheet = doc.sheetsByTitle['Maintenance'];
  
  if (!sheet.headerValues.includes('status')) {
    await sheet.setHeaderRow([...sheet.headerValues, 'status']);
  }
  
  const rows = await sheet.getRows();
  const row = rows.find((r) => r.rowNumber === rowNumber);
  
  if (row) {
    row.assign({ status: 'Completed', date: new Date().toLocaleDateString() });
    await row.save();
    
    const activitySheet = doc.sheetsByTitle['Activity'];
    await activitySheet.addRow({
      id: Date.now().toString(),
      user: 'App User',
      action: `Completed maintenance: ${row.get('title')}`,
      timestamp: new Date().toISOString()
    });

    revalidatePath('/maintenance');
    revalidatePath('/');
  }
}

export async function addMaintenance(formData: FormData) {
  const doc = await getGoogleSheet();
  const sheet = doc.sheetsByTitle['Maintenance'];
  
  if (!sheet.headerValues.includes('status')) {
    await sheet.setHeaderRow([...sheet.headerValues, 'status']);
  }
  
  await sheet.addRow({
    id: Date.now().toString(),
    title: formData.get('title') as string,
    technician: formData.get('technician') as string,
    nextDueDate: formData.get('nextDueDate') as string,
    date: 'Pending',
    status: 'Scheduled'
  });
  
  const activitySheet = doc.sheetsByTitle['Activity'];
  await activitySheet.addRow({
    id: Date.now().toString(),
    user: 'App User',
    action: `Added maintenance: ${formData.get('title') as string}`,
    timestamp: new Date().toISOString()
  });

  revalidatePath('/maintenance');
  revalidatePath('/');
}

export async function removePantryItem(rowNumber: number) {
  const doc = await getGoogleSheet();
  const sheet = doc.sheetsByTitle['Pantry'];
  const rows = await sheet.getRows();
  
  const row = rows.find((r) => r.rowNumber === rowNumber);
  if (row) {
    row.assign({ status: 'Removed', lastUpdatedBy: 'App User' });
    await row.save();
    
    const activitySheet = doc.sheetsByTitle['Activity'];
    await activitySheet.addRow({
      id: Date.now().toString(),
      user: 'App User',
      action: `Removed pantry item ${row.get('name')}`,
      timestamp: new Date().toISOString()
    });

    revalidatePath('/pantry');
    revalidatePath('/shopping');
    revalidatePath('/');
  }
}
