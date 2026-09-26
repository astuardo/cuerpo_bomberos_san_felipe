# Portal Institucional y CMS - Cuerpo de Bomberos de San Felipe
## Fundado el 11 de Marzo de 1883 · Valle de Aconcagua, Región de Valparaíso

Este proyecto implementa el sitio web oficial y portal autoadministrable para el **Cuerpo de Bomberos de San Felipe**, diseñado con la estética, estructura y jerarquía visual del **Cuerpo de Bomberos de Santiago (CBS - [www.cbs.cl](https://www.cbs.cl/))**.

---

## 🚒 Características Principales

1. **Diseño Visual e Identidad Institucional:**
   * **Paleta Oficial:** Rojo Bomberos (`#EB412F` / `#C40000`), Gris Grafito (`#434343`) y acentos dorados.
   * **Tipografía Oficial:** `Figtree` / `Montserrat` para titulares de alto impacto y `Roboto` para lectura nítida.
   * **Topbar Superior:** Teléfono de emergencia **132**, enlaces institucionales, redes sociales oficiales ([Instagram @bomberos_san_felipe](https://www.instagram.com/bomberos_san_felipe/) y [Facebook](https://www.facebook.com/p/Cuerpo-de-Bomberos-San-Felipe-100069827245670/)) y botón de recaudación *"Quiero Cooperar"*.
   * **Header Principal:** Menú multinivel (*Inicio, Institución, Las 7 Compañías, Especialidades, Noticias, Cuarteles*) con buscador y acceso seguro para el encargado.
   * **Hero Slider Dinámico:** Carrusel panorámico con los lemas institucionales: *"Constancia y Disciplina"*, *"Desde 1883 al servicio de San Felipe y Aconcagua"*.
   * **Cintillo de Alertas en Vivo:** Banner dinámico para alertar a la comunidad sobre emergencias de gran magnitud o alertas tempranas de incendios.
   * **Barra de Métricas:** 7 Compañías, +450 Voluntarios, 141 Años de Historia, +1.200 Emergencias al año, 100% Voluntarios.
   * **Módulo "¿Qué Hacemos?":** Especialidades operativas: Incendios Estructurales, Rescate Vehicular, **GERSA Subacuático** (río Aconcagua), **Rescate Agreste y Montaña**, Incendios Forestales e Interfaz (GTO) y HazMat.
   * **Las 7 Compañías de San Felipe:**
     * **1ª Cía. Bomba Aconcagua:** Fundada en 1883, decana del Valle (Agua y Zapadores).
     * **2ª Cía. La Internacional:** Fundada en 1895 (Rescate Vehicular y Agua).
     * **3ª Cía. San Felipe:** Extinción y gran caudal de agua.
     * **4ª Cía. Bomba Almendral (Moisés del Fierro):** Lema *"Vigentes a toda hora"*, combate forestal GTO.
     * **5ª Cía. Bomba Curimón:** Sector histórico de Curimón y autopista CH-60.
     * **6ª Cía. Bomba Panquehue:** Nuevo cuartel y Grupo Especializado de Rescate Subacuático (**GERSA**).
     * **7ª Cía. San Felipe:** Especialistas en **Rescate Agreste y de Montaña**.
   * **Tu Cuartel Más Cercano:** Mapa interactivo con la ubicación geográfica de los cuarteles y el Cuartel General en Merced 832.
   * **Footer Corporativo Rojo:** Teléfonos de la Central de Despacho (34 251 8817 / 132), redes y accesos normativos.

---

## 🔐 Panel de Administración (CMS para el Encargado de Prensa)

El portal incluye un panel de administración accesible directamente desde el botón **"Acceso Encargado"** en la cabecera:
* **Credenciales por Defecto:**
  * **Usuario:** `admin`
  * **Contraseña:** `bomberosanfelipe2026`
* **Funcionalidades del CMS:**
  * **Publicación de Noticias:** Título, categoría (*Actualidad, Emergencias, Capacitación, Compañías*), autor, extracto, cuerpo completo, foto de portada y selector de estado (*Publicado* o *Borrador*).
  * **Edición y Eliminación:** Gestión completa de notas de prensa en tiempo real.
  * **Control de Alertas en Portada:** Interruptor para encender/apagar el cintillo de alerta de emergencia y redactar avisos urgentes para la población del Valle.

---

## 💻 Instrucciones de Ejecución

### 1. Iniciar el Backend (API REST)
```bash
cd backend
npm install
npm run dev
# Servidor ejecutándose en http://localhost:4000
```

### 2. Iniciar el Frontend (Portal Web)
```bash
cd frontend
npm install
npm run dev
# Portal web disponible en http://localhost:3000
```
