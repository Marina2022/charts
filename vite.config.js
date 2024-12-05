import {defineConfig} from 'vite'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html', // Главный файл
        page2: 'try.html', // Второй файл        
        scatter: 'scatter-plot.html', // Второй файл        
        hitMap: 'heat-map.html',
        histogram: 'histogram.html',
        lineChart: 'line-chart.html',
        pieChart: 'pie-chart',        
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },  
  resolve: {
    alias: {
      // '@': '/src',
      "@": path.resolve(__dirname, "./src"),
    },
  },  
})
