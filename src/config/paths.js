// Пути к ресурсам
// После сборки все ресурсы находятся в assets/
// Используем BASE_URL для поддержки GitHub Pages
const base = import.meta.env.BASE_URL
export const paths = {
  models: `${base}assets/models/`,
  audio: `${base}assets/audio/`,
  img: `${base}assets/img/`,
}
