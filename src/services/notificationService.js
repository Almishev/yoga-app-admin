import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebase';

export const sendPushNotification = async (title, body, data = {}) => {
  try {
    const tokensRef = collection(db, 'pushTokens');
    const tokensSnapshot = await getDocs(tokensRef);
    
    if (tokensSnapshot.empty) {
      console.log('No push tokens found');
      return { success: true, sent: 0 };
    }

    const tokens = tokensSnapshot.docs
      .map(doc => doc.data().expoPushToken)
      .filter(Boolean);
    
    if (tokens.length === 0) {
      console.log('No valid push tokens found');
      return { success: true, sent: 0 };
    }

    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
      data,
    }));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    
    const successCount = result.data?.filter(r => r.status === 'ok').length || 0;
    
    console.log(`Push notifications sent: ${successCount}/${tokens.length}`);
    
    return { 
      success: true, 
      sent: successCount, 
      total: tokens.length,
      result 
    };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: error.message };
  }
};
