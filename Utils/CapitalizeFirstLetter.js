export default function capitalizeFirstLetter(string) {
  string = string ? string : 'home' 
  return string.charAt(0).toUpperCase() + string.slice(1);
}