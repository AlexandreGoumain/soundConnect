# SoundConnect - Système d'utilitaires CSS personnalisé

Ce projet utilise un système de classes utilitaires SCSS personnalisé inspiré de Tailwind CSS, offrant une approche "utility-first" avec un contrôle total sur le code généré.

## Structure du système

Le système est organisé en modules SCSS :

-   **colors.scss** : Palette de couleurs et classes de couleurs
-   **spacing.scss** : Marges et paddings
-   **typography.scss** : Tailles de police, poids, alignement, etc.
-   **flexbox.scss** : Classes pour Flexbox et Grid
-   **sizing.scss** : Largeurs et hauteurs
-   **borders.scss** : Bordures et coins arrondis
-   **effects.scss** : Ombres et effets visuels
-   **utilities.scss** : Utilitaires divers
-   **responsive.scss** : Media queries et classes responsive

## Utilisation

### Couleurs

```jsx
<div className="bg-primary text-white">Contenu</div>
<div className="text-secondary hover:text-primary">Texte interactif</div>
```

### Espacement

```jsx
<div className="m-4 p-2">Marges et padding</div>
<div className="mt-2 pb-4">Marge supérieure et padding inférieur</div>
<div className="mx-auto py-2">Centré horizontalement avec padding vertical</div>
```

### Typographie

```jsx
<h1 className="text-2xl font-bold">Titre</h1>
<p className="text-base text-center">Texte centré</p>
```

### Flexbox

```jsx
<div className="flex justify-between items-center">
  <div>Élément 1</div>
  <div>Élément 2</div>
</div>

<div className="grid grid-cols-3 gap-4">
  <div>Grille 1</div>
  <div>Grille 2</div>
  <div>Grille 3</div>
</div>
```

### Tailles

```jsx
<div className="w-full h-screen">Plein écran</div>
<div className="w-1-2">Moitié de largeur</div>
<div className="h-64">Hauteur fixe</div>
```

### Bordures

```jsx
<div className="border border-gray rounded-md">Élément avec bordure</div>
<div className="border-b-2 border-primary">Bordure inférieure</div>
```

### Effets

```jsx
<div className="shadow-md hover:shadow-lg">Carte avec ombre</div>
<div className="opacity-75">Élément semi-transparent</div>
```

### Responsive

Le système utilise une approche mobile-first avec des préfixes pour différentes tailles d'écran :

```jsx
<div className="w-full md:w-1-2 lg:w-1-3">
  Largeur qui s'adapte aux différentes tailles d'écran
</div>

<div className="flex-col md:flex-row">
  Passe de colonne à ligne sur les écrans moyens et grands
</div>
```

## Points techniques

-   Les fractions utilisent des tirets au lieu de barres obliques (ex: `w-1-2` au lieu de `w-1/2`)
-   Les nombres décimaux utilisent des tirets au lieu de points (ex: `p-0-5` au lieu de `p-0.5`)
-   Les préfixes responsive sont : `sm:`, `md:`, `lg:`, `xl:`

## Avantages par rapport à Tailwind CSS

-   Contrôle total sur le code généré
-   Personnalisation simplifiée
-   Taille du bundle optimisée
-   Noms de classes cohérents avec la syntaxe Tailwind
-   Documentation spécifique au projet
