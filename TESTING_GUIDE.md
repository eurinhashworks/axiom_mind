# 🧪 Guide de Test de l'Authentification Google - AXIOM

**Date :** 19 novembre 2025  
**Serveur :** http://localhost:3001/

---

## ✅ Checklist de Test

### 1. **Page de Login** (Test Initial)

**Actions :**
1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:3001/`
3. Vous devriez voir la page de login

**✅ Ce que vous devez voir :**
- Logo "AXIOM" en dégradé indigo/violet
- Texte : "L'Intelligence Artificielle pour Architectes d'Idées"
- Icône d'ampoule dans un cercle
- Bouton blanc "Continuer avec Google" avec le logo Google
- Texte en bas : "En vous connectant, vous acceptez nos conditions d'utilisation"

**❌ Si vous voyez :**
- Un écran blanc → Vérifiez la console du navigateur (F12) pour les erreurs
- "Firebase: Error" → Vérifiez vos variables d'env dans `.env` ou `.env.local`

---

### 2. **Login avec Google** (Test d'Authentification)

**Actions :**
1. Cliquez sur "Continuer avec Google"
2. Une popup Google s'ouvre
3. Sélectionnez votre compte Google
4. Acceptez les permissions

**✅ Ce que vous devez voir :**
- La popup Google s'ouvre correctement
- Liste de vos comptes Google
- Après sélection : redirection vers l'app AXIOM

**❌ Si vous voyez :**
- "Firebase: Error (auth/popup-blocked)" → Autorisez les popups dans votre navigateur
- "Firebase: Error (auth/unauthorized-domain)" → Ajoutez `localhost` dans Firebase Console > Authentication > Settings > Authorized domains

---

### 3. **Application Principale** (Après Login)

**Actions :**
1. Après le login, vous êtes redirigé vers l'app
2. Observez le header

**✅ Ce que vous devez voir :**
- Logo "AXIOM" centré
- Texte : "L'Inbox Chaotique: Videz votre cerveau."
- **À DROITE :** Votre photo de profil Google + prénom
- Zone de saisie en bas avec boutons micro et envoi

**❌ Si vous ne voyez pas votre profil :**
- Vérifiez la console (F12) pour des erreurs Firebase
- Vérifiez que vous êtes bien connecté (rechargez la page)

---

### 4. **Créer une Note** (Test de Synchronisation)

**Actions :**
1. Dans la zone de texte en bas, tapez : "Test de synchronisation Firebase"
2. Cliquez sur le bouton d'envoi (flèche)
3. La note apparaît dans la liste

**✅ Ce que vous devez voir :**
- La note s'affiche immédiatement
- Badge jaune "À Tisser"
- Texte "Cliquer pour tisser →" au hover

**🔥 Vérification Firebase :**
1. Ouvrez Firebase Console : https://console.firebase.google.com/
2. Sélectionnez votre projet
3. Allez dans **Firestore Database**
4. Naviguez : `users > [votre-user-id] > data > notes`
5. Vous devriez voir votre note dans le document

**✅ Si vous voyez la note dans Firestore :**
→ **SUCCÈS !** La synchronisation fonctionne ! 🎉

---

### 5. **Menu Utilisateur** (Test de Navigation)

**Actions :**
1. Cliquez sur votre photo de profil en haut à droite
2. Un menu dropdown s'affiche

**✅ Ce que vous devez voir :**
- Votre photo de profil (grande)
- Votre nom complet
- Votre email
- Stats : Notes (nombre) et Idées (nombre)
- Bouton rouge "Déconnexion"

---

### 6. **Déconnexion** (Test de Logout)

**Actions :**
1. Dans le menu utilisateur, cliquez sur "Déconnexion"
2. Confirmez dans la popup

**✅ Ce que vous devez voir :**
- Redirection vers la page de login (`/login`)
- Vous n'êtes plus connecté

**❌ Si ça ne fonctionne pas :**
- Vérifiez la console pour les erreurs
- Essayez de recharger la page

---

### 7. **Reconnexion** (Test de Persistence)

**Actions :**
1. Reconnectez-vous avec Google
2. Retournez sur l'app

**✅ Ce que vous devez voir :**
- Vos notes précédentes sont toujours là
- Elles ont été chargées depuis Firestore

**🔥 Vérification Migration LocalStorage :**
- Si vous aviez des données en LocalStorage avant, elles devraient apparaître
- Vérifiez la console du navigateur pour les logs : "📦 Migration de notes depuis LocalStorage"

---

### 8. **Test Multi-Onglets** (Test de Synchronisation en Temps Réel)

**Actions :**
1. Gardez un onglet avec l'app ouvert
2. Ouvrez un 2ème onglet : `http://localhost:3001/`
3. Connectez-vous (ou déjà connecté automatiquement)
4. Créez une note dans l'onglet 2
5. Attendez 1-2 secondes
6. Rechargez l'onglet 1

**✅ Ce que vous devez voir :**
- La nouvelle note apparaît dans l'onglet 1
- Synchronisation fonctionnelle

**Note :** La synchronisation temps réel n'est pas encore implémentée (c'est dans le Roadmap). Pour l'instant, un refresh est nécessaire.

---

## 🐛 Troubleshooting Courant

### Erreur : "Cannot find module 'firebase/auth'"
**Solution :**
```bash
pnpm install
```

### Erreur : "Firebase: No Firebase App '[DEFAULT]' has been created"
**Solution :**
- Vérifiez que `.env` ou `.env.local` contient toutes les variables Firebase
- Vérifiez qu'il n'y a pas de faute de frappe dans les noms de variables
- Redémarrez le serveur : `pnpm dev`

### Erreur : "Missing or insufficient permissions"
**Solution :**
- Vérifiez les règles Firestore (voir FIREBASE_SETUP.md étape 5)
- Elles doivent contenir : `allow read, write: if request.auth != null && request.auth.uid == userId;`

### La page reste blanche
**Solution :**
1. Ouvrez la console (F12)
2. Copiez les erreurs
3. Vérifiez que Firebase est bien configuré
4. Vérifiez que toutes les dépendances sont installées : `pnpm install`

### Le login Google ne fait rien
**Solution :**
1. Vérifiez que les popups ne sont pas bloquées
2. Vérifiez Firebase Console > Authentication > Google est activé
3. Vérifiez que `localhost` est dans les domaines autorisés

---

## 📊 Métriques de Succès

Cochez au fur et à mesure :

- [ ] Page de login s'affiche correctement
- [ ] Login Google fonctionne (popup + redirection)
- [ ] Photo de profil apparaît en haut à droite
- [ ] Création d'une note fonctionne
- [ ] Note visible dans Firebase Console
- [ ] Menu utilisateur s'ouvre
- [ ] Déconnexion fonctionne
- [ ] Reconnexion fonctionne
- [ ] Notes persistées après reconnexion

**Si tous les points sont cochés : ✅ L'authentification est 100% fonctionnelle !**

---

## 🎉 Prochaines Étapes

Une fois tous les tests passés, vous pouvez :

1. **Tester avec des vraies données** - Créez plusieurs notes, triez-les, etc.
2. **Inviter d'autres utilisateurs** - Chacun aura son propre espace
3. **Déployer en production** - Vercel, Netlify, etc.
4. **Implémenter la prochaine fonctionnalité** - Voir ROADMAP.md (#2: Recherche globale)

---

## 📝 Notes de Développement

### Console du Navigateur (F12)

Vous devriez voir ces logs lors du premier login avec des données LocalStorage existantes :

```
📦 Migration de notes depuis LocalStorage (X entrées)
✅ Migration de notes terminée
📦 Migration de ideas depuis LocalStorage (Y entrées)
✅ Migration de ideas terminée
```

### Structure Firestore

Après quelques notes, votre Firestore devrait ressembler à :

```
users/
  ├── [user-id]/
      ├── displayName: "Votre Nom"
      ├── email: "votre@email.com"
      ├── lastLogin: "2025-11-19T17:00:00Z"
      └── data/
          ├── notes/
          │   └── notes: [ {...}, {...} ]
          └── ideas/
              └── ideas: [ {...}, {...} ]
```

---

**Bon test ! 🚀**
