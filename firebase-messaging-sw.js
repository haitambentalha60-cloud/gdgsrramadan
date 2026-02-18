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

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('📬 Message reçu en arrière-plan:', payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || 'Ramadan League';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || payload.data?.message,
        icon: '/path/to/icon-192x192.png', // Ajoutez votre icône ici
        badge: '/path/to/badge-72x72.png', // Ajoutez votre badge ici
        tag: 'ramadan-league-notification',
        requireInteraction: true,
        data: payload.data,
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'view',
                title: 'Voir le match'
            },
            {
                action: 'close',
                title: 'Fermer'
            }
        ]
    };

    // Personnaliser selon le type de notification
    if (payload.data?.type === 'goal') {
        notificationOptions.icon = '/path/to/goal-icon.png';
        notificationOptions.vibrate = [200, 100, 200, 100, 200];
        notificationOptions.badge = '⚽';
    } else if (payload.data?.type === 'match-start') {
        notificationOptions.icon = '/path/to/start-icon.png';
        notificationOptions.badge = '🟢';
    } else if (payload.data?.type === 'match-end') {
        notificationOptions.icon = '/path/to/end-icon.png';
        notificationOptions.badge = '🔴';
    }

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('🖱️ Notification cliquée:', event);
    
    event.notification.close();

    if (event.action === 'view') {
        // Ouvrir la page du match
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Juste fermer
        return;
    } else {
        // Clic sur la notification elle-même
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
