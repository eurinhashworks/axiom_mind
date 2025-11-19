# 🔥 Guide de Configuration Firebase - AXIOM

## Étape 1 : Créer un Projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nom du projet : `axiom-mind-prod` (ou votre choix)
4. Activez Google Analytics (optionnel mais recommandé)
5. Créez le projet

## Étape 2 : Enregistrer une Application Web

1. Dans la console Firebase, cliquez sur l'icône Web `</>`
2. Nom de l'app : `AXIOM Web`
3. **Cochez** "Also set up Firebase Hosting" (optionnel)
4. Cliquez sur "Enregistrer l'app"
5. **Copiez** la configuration Firebase (vous en aurez besoin plus tard)

## Étape 3 : Activer Google Authentication

1. Dans Firebase Console, allez dans **Authentication**
2. Cliquez sur "Get Started" (si c'est votre premier setup)
3. Onglet **Sign-in method**
4. Cliquez sur **Google**
5. Activez le bouton
6. Configurez :
   - **Support email**: votre-email@gmail.com
   - **Nom public du projet**: AXIOM
7. Sauvegardez

## Étape 4 : Créer Firestore Database

1. Dans Firebase Console, allez dans **Firestore Database**
2. Cliquez sur "Create database"
3. Mode : **Production** (recommendé)
4. Région : Choisissez la plus proche (ex: `europe-west1` pour l'Europe)
5. Créez

## Étape 5 : Configurer les Règles de Sécurité

1. Dans Firestore, allez dans l'onglet **Règles**
2. Remplacez le contenu par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les utilisateurs
    match /users/{userId} {
      // Seul l'utilisateur peut lire/écrire ses propres données
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Données utilisateur (notes, ideas, etc.)
      match /data/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Publiez les règles

## Étape 6 : Configurer les Variables d'Environnement

1. Copiez `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

2. Ouvrez `.env.local` et remplissez les valeurs Firebase :

```env
# Gemini (déjà configuré)
VITE_GEMINI_API_KEY=votre_clé_existante

# Firebase - Remplacez par VOS valeurs
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=axiom-mind-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=axiom-mind-prod
VITE_FIREBASE_STORAGE_BUCKET=axiom-mind-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**💡 Où trouver ces valeurs ?**
- Firebase Console > ⚙️ Project Settings > Your apps > SDK setup and configuration

## Étape 7 : Ajouter les Domaines Autorisés

1. Dans Firebase Console > **Authentication** > **Settings**
2. Onglet **Authorized domains**
3. Ajoutez (si pas déjà présents) :
   - `localhost`
   - Votre domaine de production (ex: `axiom.vercel.app`)

## Étape 8 : Tester l'Application

1. Lancez le serveur de développement :

```bash
pnpm dev
```

2. Ouvrez `http://localhost:5173`
3. Vous devriez voir la page de login
4. Cliquez sur "Continuer avec Google"
5. Sélectionnez votre compte Google
6. ✅ Vous êtes connecté !

## 🔐 Sécurité : Checklist

- [ ] `.env.local` est dans `.gitignore`
- [ ] Les règles Firestore sont configurées (pas de `allow read, write: if true;`)
- [ ] Les domaines autorisés sont limités
- [ ] Google Analytics est activé (pour monitorer l'usage)
- [ ] Le mode Firestore est en **Production** (pas en Test)

## 🚨 Troubleshooting

### Erreur : "Firebase: Error (auth/unauthorized-domain)"
**Solution :** Ajoutez votre domaine dans Authorized domains (Étape 7)

### Erreur : "Missing or insufficient permissions"
**Solution :** Vérifiez les règles Firestore (Étape 5)

### Erreur : "Firebase: Error (auth/popup-blocked)"
**Solution :** Autorisez les popups dans votre navigateur

### Les données ne se sauvegardent pas
**Solution :** 
1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez que l'utilisateur est bien connecté
3. Vérifiez les règles Firestore

## 📊 Quotas Gratuits Firebase (Spark Plan)

- **Authentication**: Illimité
- **Firestore**: 
  - 1 GB de stockage
  - 10 GB/mois de transfert réseau
  - 50,000 lectures/jour
  - 20,000 écritures/jour
  - 20,000 suppressions/jour

**💡 Conseil :** Pour un usage personnel ou startup early-stage, le plan gratuit est largement suffisant !

## 🎉 C'est Fait !

Vous avez maintenant :
✅ Authentification Google fonctionnelle
✅ Base de données Firestore sécurisée
✅ Synchronisation automatique des données
✅ Migration depuis LocalStorage

**Prochaines étapes :**
- Testez en créant quelques notes
- Vérifiez dans Firebase Console > Firestore que les données apparaissent
- Testez la déconnexion/reconnexion

---

**Besoin d'aide ?** Consultez la [documentation Firebase](https://firebase.google.com/docs) ou ouvrez une issue sur GitHub.
