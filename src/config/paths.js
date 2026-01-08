// Пути к ресурсам
// После сборки все ресурсы находятся в assets/
// В dev режиме используем /assets/... (middleware перенаправляет на public)
// В production используем /assets/... (файлы уже в правильных папках)
export const paths = {
  models: '/assets/models/',
  audio: '/assets/audio/',
  img: '/assets/img/',
}
