// Ceci déclare que tous les fichiers .css sont des modules
// et n'exportent rien de spécifique pour TypeScript.
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}