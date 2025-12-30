import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import App from './App.vue'
import './style.css'

// 引入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus'

// 引入Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入权限指令
import { permissionDirective } from './directives/permission'

const app = createApp(App)
const pinia = createPinia()

// 使用Pinia持久化插件
pinia.use(piniaPluginPersistedstate)

// 使用Element Plus
app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)

// 注册全局权限指令
app.directive('permission', permissionDirective)

// 全局挂载ElMessage到window对象，便于在工具函数中使用
app.config.globalProperties.$message = ElMessage
window.$message = ElMessage

app.mount('#app')
