import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, readdirSync, existsSync, unlinkSync, rmdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Plugin для обслуживания assets в dev режиме и организации при сборке
function organizeAssetsPlugin() {
  return {
    name: 'organize-assets',
    configureServer(server) {
      // В dev режиме обслуживаем /assets/... из public
      // Так как root: 'src' и publicDir: '../public',
      // Vite автоматически обслуживает файлы из public по корневому пути
      // Нам нужно перенаправить /assets/... на правильные пути
      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith('/assets/models/')) {
          const fileName = req.url.replace('/assets/models/', '')
          // Файлы из public доступны напрямую, но нам нужно изменить путь
          req.url = `/${fileName}`
        } else if (req.url.startsWith('/assets/audio/')) {
          const filePath = req.url.replace('/assets/audio/', '')
          req.url = `/audio/${filePath}`
        } else if (req.url.startsWith('/assets/img/')) {
          const filePath = req.url.replace('/assets/img/', '')
          req.url = `/img/${filePath}`
        }
        next()
      })
    },
    closeBundle() {
      const publicDir = join(__dirname, 'public')
      const distDir = join(__dirname, 'docs')
      const assetsDir = join(distDir, 'assets')

      if (!existsSync(publicDir)) return

      // Создаем структуру папок
      const modelsDir = join(assetsDir, 'models')
      const audioDir = join(assetsDir, 'audio')
      const imgDir = join(assetsDir, 'img')

      ;[modelsDir, audioDir, imgDir].forEach(dir => {
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true })
        }
      })

      // Функция для рекурсивного копирования
      function copyRecursive(src, dest) {
        const entries = readdirSync(src, { withFileTypes: true })

        for (const entry of entries) {
          const srcPath = join(src, entry.name)
          const destPath = join(dest, entry.name)

          if (entry.isDirectory()) {
            if (!existsSync(destPath)) {
              mkdirSync(destPath, { recursive: true })
            }
            copyRecursive(srcPath, destPath)
          } else {
            copyFileSync(srcPath, destPath)
          }
        }
      }

      // Копируем модели
      const gltfFiles = readdirSync(publicDir).filter(f => f.toLowerCase().endsWith('.gltf'))
      gltfFiles.forEach(file => {
        copyFileSync(join(publicDir, file), join(modelsDir, file))
      })

      // Копируем аудио
      const audioPath = join(publicDir, 'audio')
      if (existsSync(audioPath)) {
        copyRecursive(audioPath, audioDir)
      }

      // Копируем изображения
      const imgPath = join(publicDir, 'img')
      if (existsSync(imgPath)) {
        copyRecursive(imgPath, imgDir)
      }

      // Копируем manifest.json в корень dist
      const manifestPath = join(publicDir, 'manifest.json')
      if (existsSync(manifestPath)) {
        copyFileSync(manifestPath, join(distDir, 'manifest.json'))
      }

      // Удаляем файлы, которые Vite автоматически скопировал в корень dist
      // (они теперь в assets/)
      try {
        // Удаляем GLTF файлы из корня
        gltfFiles.forEach(file => {
          const rootFile = join(distDir, file)
          if (existsSync(rootFile)) {
            unlinkSync(rootFile)
          }
        })

        // Удаляем папки audio и img из корня, если они есть
        const rootAudio = join(distDir, 'audio')
        const rootImg = join(distDir, 'img')
        if (existsSync(rootAudio)) {
          const entries = readdirSync(rootAudio, { withFileTypes: true })
          entries.forEach(entry => {
            const entryPath = join(rootAudio, entry.name)
            if (entry.isDirectory()) {
              rmdirSync(entryPath, { recursive: true })
            } else {
              unlinkSync(entryPath)
            }
          })
          rmdirSync(rootAudio)
        }
        if (existsSync(rootImg)) {
          const entries = readdirSync(rootImg, { withFileTypes: true })
          entries.forEach(entry => {
            const entryPath = join(rootImg, entry.name)
            if (entry.isDirectory()) {
              rmdirSync(entryPath, { recursive: true })
            } else {
              unlinkSync(entryPath)
            }
          })
          rmdirSync(rootImg)
        }
      } catch (e) {
        console.warn('Error cleaning up root files:', e)
      }
    },
  }
}

export default defineConfig({
  root: 'src',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: '../docs',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]

          // Организуем ресурсы по типам
          if (ext === 'gltf' || ext === 'glb') {
            return 'assets/models/[name][extname]'
          }
          if (ext === 'mp3' || ext === 'wav' || ext === 'ogg') {
            return 'assets/audio/[name][extname]'
          }
          if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp') {
            return 'assets/img/[name][extname]'
          }

          return 'assets/[name][extname]'
        },
      },
    },
  },
  publicDir: '../public',
  plugins: [organizeAssetsPlugin()],
})
