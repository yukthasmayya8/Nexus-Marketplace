import { collection, addDoc, serverTimestamp, getDocs, query, limit, where } from 'firebase/firestore';
import { db } from '../firebase';
import { MASTER_CATALOG } from '../data/catalog';

export async function seedMarketplace(sellerId: string) {
  // Fetch existing products for this seller
  const q = query(collection(db, 'products'), where('sellerId', '==', sellerId));
  const snapshot = await getDocs(q);
  const existingNames = new Set(snapshot.docs.map(doc => doc.data().name));

  let addedCount = 0;
  for (const item of MASTER_CATALOG) {
    if (existingNames.has(item.name)) continue;
    
    try {
      await addDoc(collection(db, 'products'), {
        ...item,
        sellerId,
        createdAt: serverTimestamp()
      });
      addedCount++;
    } catch (e) {
      console.error(`Failed to seed ${item.name}`, e);
    }
  }
  
  return addedCount;
}
