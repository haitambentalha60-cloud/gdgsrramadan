// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyDAGuFQg0ofptIPk2MBvwBQQYtZUDdX8Dk",
    authDomain: "gdgsrramadan.firebaseapp.com",
    databaseURL: "https://gdgsrramadan-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gdgsrramadan",
    storageBucket: "gdgsrramadan.firebasestorage.app",
    messagingSenderId: "526902571325",
    appId: "1:526902571325:web:886c4939b9cf422fe05554",
    measurementId: "G-BE6D61PBDN"
});

const messaging = firebase.messaging();

// Handle messages from the main page
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { notification } = event.data;
        
        self.registration.showNotification(notification.title, {
            body: notification.body,
            icon: 'https://cdn-icons-png.flaticon.com/512/53/53283.png',
            badge: 'https://cdn-icons-png.flaticon.com/512/53/53283.png',
            tag: 'ramadan-league-' + Date.now(),
            requireInteraction: true,
            vibrate: [200, 100, 200],
            data: notification.data
        });
    }
});

// Handle background messages (when page is not active)
messaging.onBackgroundMessage((payload) => {
    console.log('📬 Message reçu en arrière-plan:', payload);

    const notificationData = payload.data || payload.notification || {};
    
    const notificationTitle = notificationData.title || payload.notification?.title || 'Ramadan League';
    const notificationOptions = {
        body: notificationData.body || payload.notification?.body || notificationData.message || '',
        icon: 'https://cdn-icons-png.flaticon.com/512/53/53283.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/53/53283.png',
        tag: 'ramadan-league-notification',
        requireInteraction: true,
        data: notificationData,
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'view',
                title: 'Voir'
            },
            {
                action: 'close',
                title: 'Fermer'
            }
        ]
    };

    // Personnaliser selon le type de notification
    if (notificationData.type === 'goal') {
        notificationOptions.vibrate = [200, 100, 200, 100, 200];
    }

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('🖱️ Notification cliquée:', event);
    
    event.notification.close();

    if (event.action === 'view' || !event.action) {
        // Ouvrir ou focus la page
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((clientList) => {
                    // Si une fenêtre est déjà ouverte, la focus
                    for (let i = 0; i < clientList.length; i++) {
                        const client = clientList[i];
                        if (client.url.includes(self.registration.scope) && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // Sinon, ouvrir une nouvelle fenêtre
                    if (clients.openWindow) {
                        return clients.openWindow('/');
                    }
                })
        );
    }
});

console.log('✅ Service Worker Firebase Messaging initialisé');
