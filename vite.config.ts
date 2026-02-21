
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // تم التغيير إلى مسار نسبي ليعمل على أي اسم مستودع
})
