<template>
  <Transition name="page-slide-left" mode="out-in" appear>
    <div class="abcxyz-page container py-4" key="abcxyz-page">
      <div class="row mb-4 align-items-start">
        <!-- Zeitstrahl -->
        <div class="col-lg-3 mb-3 mb-lg-0 d-flex justify-content-center">
          <div class="steps-vertical">
            <div
              v-for="step in 4"
              :key="step"
              class="step"
              :class="{ active: currentStep === step, completed: currentStep > step }"
              @click="goToStep(step)"
              :tabindex="0"
              style="outline:none"
            >
              <div class="step-number">{{ step }}</div>
              <div class="step-title">{{ getStepTitle(step) }}</div>
            </div>
          </div>
        </div>
        <!-- Tabelle und Info-Tooltips -->
        <div class="col-lg-9">
          <h2 class="h4 mb-3">So funktioniert's:</h2>
          <div class="table-responsive abctable-wrap mb-2">
            <table class="table table-bordered text-center align-middle abctable">
              <thead class="table-light">
                <tr>
                  <th>PRODUKT</th>
                  <th>
                    MENGE
                    <span class="step-tooltip" tabindex="0">
                      <i class="mdi mdi-information"></i>
                      <span class="step-tooltiptext">Anzahl der verkauften/gelagerten Stücke</span>
                    </span>
                  </th>
                  <th>
                    STÜCKPREIS (€)
                    <span class="step-tooltip" tabindex="0">
                      <i class="mdi mdi-information"></i>
                      <span class="step-tooltiptext">Preis pro Stück</span>
                    </span>
                  </th>
                  <th>
                    WERT (€)
                    <span class="step-tooltip" tabindex="0">
                      <i class="mdi mdi-information"></i>
                      <span class="step-tooltiptext">WERT = MENGE × STÜCKPREIS</span>
                    </span>
                  </th>
                  <th>
                    ANTEIL (%)
                    <span class="step-tooltip" tabindex="0">
                      <i class="mdi mdi-information"></i>
                      <span class="step-tooltiptext">ANTEIL = (WERT / Gesamtwert) × 100</span>
                    </span>
                  </th>
                  <th>
                    KUMULIERT (%)
                    <span class="step-tooltip" tabindex="0">
                      <i class="mdi mdi-information"></i>
                      <span class="step-tooltiptext">Kumuliert = Summe der bisherigen Anteile</span>
                    </span>
                  </th>
                  <th>KLASSE</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in sortedProducts"
                  :key="product.id"
                  :class="{
                    'abc-a': product.abcClass === 'A',
                    'abc-b': product.abcClass === 'B',
                    'abc-c': product.abcClass === 'C'
                  }"
                >
                  <td>{{ product.name }}</td>
                  <td>{{ product.quantity }}</td>
                  <td>{{ product.unitPrice.toLocaleString('de-DE') }}</td>
                  <td>{{ product.value.toLocaleString('de-DE') }}</td>
                  <td>{{ product.percentage.toFixed(1) }}</td>
                  <td>{{ product.cumulative.toFixed(1) }}</td>
                  <td>
                    <span class="badge" :class="getABCBadgeClass(product.abcClass)">
                      {{ product.abcClass }}
                    </span>
                  </td>
                </tr>
                <tr class="table-secondary fw-bold">
                  <td>Gesamt</td>
                  <td>{{ totalQuantity }}</td>
                  <td></td>
                  <td>{{ totalValue.toLocaleString('de-DE') }}</td>
                  <td>100.0</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Hinweis bei Mobile -->
          <div v-if="isMobile" class="alert alert-info text-center mb-3">
            <i class="mdi mdi-rotate-orbit"></i>
            Drehen Sie Ihr Handy für eine bessere Darstellung!
          </div>
          <div class="mb-3 small text-muted">
            <strong>Klassen-Einteilung:</strong>
            <ul>
              <li><b>Klasse A:</b> 20% der Artikel, 80% des Werts</li>
              <li><b>Klasse B:</b> 30% der Artikel, 15% des Werts</li>
              <li><b>Klasse C:</b> 50% der Artikel, 5% des Werts</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Formelschritt -->
      <div class="row">
        <div class="col-lg-12">
          <div class="formula-card card mb-4">
            <div class="card-body">
              <h5 class="card-title">Aktueller Schritt: {{ getStepTitle(currentStep) }}</h5>
              <div class="formula-content">
                <div v-if="currentStep === 1">
                  <p>Berechnung des Werts für jedes Produkt:</p>
                  <p class="formula">WERT = MENGE × STÜCKPREIS</p>
                </div>
                <div v-else-if="currentStep === 2">
                  <p>Berechnung des prozentualen Anteils am Gesamtwert:</p>
                  <p class="formula">ANTEIL = (WERT / Gesamtwert) × 100%</p>
                </div>
                <div v-else-if="currentStep === 3">
                  <p>Berechnung der kumulierten Prozentsätze:</p>
                  <p class="formula">KUMULIERT = Summe der bisherigen Anteile</p>
                </div>
                <div v-else>
                  <p>Klassifizierung der Produkte:</p>
                  <ul>
                    <li>Klasse A: die ersten 20% der Artikel (nach Wert sortiert) = 80% des Werts</li>
                    <li>Klasse B: die nächsten 30% der Artikel = 15% des Werts</li>
                    <li>Klasse C: die letzten 50% der Artikel = 5% des Werts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Übungsbereich -->
      <div class="exercise-section mt-5">
        <h5>Übung: Fehlende Werte berechnen</h5>
        <table class="table table-sm table-bordered text-center">
          <thead class="table-light">
            <tr>
              <th>Produkt</th>
              <th>Menge</th>
              <th>Stückpreis (€)</th>
              <th>Wert (€)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in exerciseRows" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.quantity }}</td>
              <td>{{ row.unitPrice.toFixed(2) }}</td>
              <td>
                <input
                  v-if="row.missing"
                  type="number"
                  step="0.01"
                  v-model.number="exerciseState.userInputs[`value_${row.id}`]"
                  class="form-control form-control-sm d-inline-block w-auto"
                />
                <span v-else>{{ row.value.toFixed(2) }}</span>
                <div
                  v-if="exerciseState.feedback[`value_${row.id}`]"
                  class="exercise-feedback"
                  :class="{
                    correct: exerciseState.feedback[`value_${row.id}`] === 'Richtig!',
                    incorrect: exerciseState.feedback[`value_${row.id}`] !== 'Richtig!'
                  }"
                >
                  {{ exerciseState.feedback[`value_${row.id}`] }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="mt-3">
          <button class="btn btn-primary me-2" @click="checkAnswers">Prüfen</button>
          <button class="btn btn-outline-secondary" @click="resetExercise">Zurücksetzen</button>
        </div>

        <div v-if="exerciseState.isCorrect === true" class="alert alert-success mt-3">
          Alle Antworten sind korrekt! Gut gemacht.
        </div>
        <div v-else-if="exerciseState.isCorrect === false" class="alert alert-danger mt-3">
          Einige Felder sind noch falsch. Schau dir die Hinweise an.
        </div>
      </div>

      <!-- XYZ-Matrix -->
      <div class="xyz-section mt-5 pt-4 border-top">
        <h3 class="h4 mb-3">Interaktive Übung: ABC-XYZ-Matrix</h3>
        <p class="mb-2">
          Ordne die folgenden Beschreibungen den richtigen Feldern in der Matrix zu.<br>
          Bereits richtig zugeordnete Karten bleiben auch nach dem Zurücksetzen erhalten!
        </p>
        <div class="row">
          <div class="col-lg-8">
            <div class="xyz-matrix-container">
              <table class="xyz-matrix">
                <thead>
                  <tr>
                    <th></th>
                    <th>X</th>
                    <th>Y</th>
                    <th>Z</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in 3" :key="rowIndex">
                    <th>{{ xyzRowLabels[rowIndex] }}</th>
                    <td v-for="(col, colIndex) in 3" :key="colIndex"
                        :class="matrixCellClass(rowIndex, colIndex)"
                        @click="selectMatrixCell(rowIndex, colIndex)">
                      <div v-if="xyzMatrix[rowIndex][colIndex] !== null">
                        {{ xyzMatrix[rowIndex][colIndex].text }}
                      </div>
                      <div v-else class="matrix-placeholder">+ Hier ablegen</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-lg-4 mt-4 mt-lg-0">
            <div class="card h-100">
              <div class="card-body">
                <h4 class="h5 mb-3">Verfügbare Karten</h4>
                <div class="xyz-cards-pool">
                  <button v-for="(card, idx) in xyzAvailableCards" :key="card.code"
                          class="xyz-card"
                          :class="{ selected: selectedCardIndex === idx }"
                          :disabled="card.placed"
                          @click="selectCard(idx)">
                    {{ card.text }}
                  </button>
                </div>
                <div class="mt-4">
                  <button class="btn btn-primary me-2" @click="checkXYZExercise">
                    <i class="mdi mdi-check-circle-outline me-1"></i> Überprüfen
                  </button>
                  <button class="btn btn-outline-secondary" @click="resetXYZExercise">
                    <i class="mdi mdi-refresh me-1"></i> Zurücksetzen
                  </button>
                </div>
                <div v-if="xyzFeedback.show" class="mt-3">
                  <div class="alert" :class="{
                    'alert-success': xyzFeedback.isCorrect,
                    'alert-danger': !xyzFeedback.isCorrect
                  }">
                    <h5 class="alert-heading">
                      <i :class="{
                        'mdi mdi-check-circle-outline text-success': xyzFeedback.isCorrect,
                        'mdi mdi-alert-circle-outline text-danger': !xyzFeedback.isCorrect
                      }" class="me-2"></i>
                      {{ xyzFeedback.isCorrect ? 'Richtig!' : 'Nicht ganz richtig' }}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> <!-- XYZ End -->
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'ABC/XYZ-Analyse – Logistik E-Learning',
  meta: [{ name: 'description', content: 'Interaktive ABC-Analyse mit Schritt-für-Schritt-Erklärung und Übung.' }]
})

const isMobile = ref(false)
onMounted(() => {
  // Checke Viewport für Mobile-Hinweis
  const checkMobile = () => isMobile.value = window.innerWidth < 992
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

const currentStep = ref(1)
function goToStep(step) {
  currentStep.value = step
}
function getStepTitle(step) {
  return ['Wert berechnen', 'Anteil berechnen', 'Kumulierte Werte', 'Klassifizierung'][step - 1]
}
// Beispielprodukte für Tabelle (Originaldaten!)
const products = reactive([
  { id: 1, name: 'Laptop',       quantity: 15, unitPrice: 1200 },
  { id: 2, name: 'Monitor',      quantity: 30, unitPrice: 350  },
  { id: 3, name: 'Tastatur',     quantity: 50, unitPrice: 80   },
  { id: 4, name: 'Drucker',      quantity: 8,  unitPrice: 450  },
  { id: 5, name: 'Lautsprecher', quantity: 25, unitPrice: 120  },
  { id: 6, name: 'Maus',         quantity: 60, unitPrice: 25   }
])

// Nach Wert sortieren, aber Klassifizierung nach Prozent der Artikel!
const sortedProducts = computed(() => {
  let arr = [...products]
  arr.forEach(p => { p.value = p.quantity * p.unitPrice })
  arr = arr.sort((a, b) => b.value - a.value)
  let total = arr.reduce((sum, p) => sum + p.value, 0)
  let cumulative = 0
  arr.forEach((p, idx) => {
    p.percentage = (p.value / total) * 100
    cumulative += p.percentage
    p.cumulative = cumulative
  })
  // Artikel in A: 20% (bei 6 Produkten: 1,2 → 1 Produkt A, 2 B, Rest C)
  const n = arr.length
  arr.forEach((p, i) => {
    if (i < Math.round(n * 0.2)) p.abcClass = 'A'
    else if (i < Math.round(n * 0.2) + Math.round(n * 0.3)) p.abcClass = 'B'
    else p.abcClass = 'C'
  })
  return arr
})

const totalValue = computed(() => sortedProducts.value.reduce((sum, p) => sum + p.value, 0))
const totalQuantity = computed(() => sortedProducts.value.reduce((sum, p) => sum + p.quantity, 0))

function getABCBadgeClass(c) {
  return c === 'A'
    ? 'bg-danger'
    : c === 'B'
      ? 'bg-warning text-dark'
      : 'bg-success'
}

// ----------------------- ÜBUNG: Neue Werte! -----------------------
const exerciseRows = [
  { id: 11, name: 'Router', quantity: 12, unitPrice: 60, value: 12*60, missing: true },
  { id: 12, name: 'USB-Stick', quantity: 50, unitPrice: 12, value: 50*12, missing: false },
  { id: 13, name: 'Switch', quantity: 10, unitPrice: 90, value: 10*90, missing: true },
  { id: 14, name: 'Beamer', quantity: 3, unitPrice: 350, value: 3*350, missing: false },
  { id: 15, name: 'Headset', quantity: 20, unitPrice: 25, value: 20*25, missing: true }
]
const exerciseState = reactive({ userInputs: {}, feedback: {}, isCorrect: null })

function checkAnswers() {
  let allRight = true
  exerciseRows.forEach(row => {
    if (row.missing) {
      const key = `value_${row.id}`
      const val = exerciseState.userInputs[key]
      if (isNaN(val) || Math.abs(val - row.value) > 0.05) {
        exerciseState.feedback[key] = 'Überprüfen Sie Ihre Berechnung'
        allRight = false
      } else {
        exerciseState.feedback[key] = 'Richtig!'
      }
    }
  })
  exerciseState.isCorrect = allRight
}

function resetExercise() {
  exerciseState.userInputs = {}
  exerciseState.feedback = {}
  exerciseState.isCorrect = null
}

// ----------------------- XYZ-MATRIX -----------------------
const xyzMatrix = ref([
  [null, null, null],
  [null, null, null],
  [null, null, null]
])
const xyzRowLabels = ['A', 'B', 'C']
const xyzColLabels = ['X', 'Y', 'Z']

const xyzCardDescriptions = [
  { code: 'AX', text: 'Hohes Volumen bzw. hoher Wertanteil' },
  { code: 'AY', text: 'Stabil und konstant im Bedarf' },
  { code: 'AZ', text: 'Schwankender Bedarf' },
  { code: 'BX', text: 'Durchschnittliches Volumen bzw. durchschnittlicher Wertanteil' },
  { code: 'BY', text: 'Schwankender Bedarf' },
  { code: 'BZ', text: 'Unregelmäßiger Bedarf' },
  { code: 'CX', text: 'Geringes Volumen bzw. geringer Wertanteil' },
  { code: 'CY', text: 'Stabil und konstant im Bedarf' },
  { code: 'CZ', text: 'Unregelmäßiger Bedarf' }
]

function shuffle(array) {
  let arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}
const xyzAvailableCards = ref([])

const correctMatrix = [
  ['AX', 'AY', 'AZ'],
  ['BX', 'BY', 'BZ'],
  ['CX', 'CY', 'CZ']
]

function resetXYZAvailableCards() {
  // Behalte richtige Karten in Matrix, setze andere zurück
  let usedCodes = []
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (xyzMatrix.value[r][c] && xyzMatrix.value[r][c].code === correctMatrix[r][c])
        usedCodes.push(xyzMatrix.value[r][c].code)

  xyzAvailableCards.value = shuffle(
    xyzCardDescriptions.map(card => ({
      ...card,
      placed: usedCodes.includes(card.code)
    }))
  )
}

function resetXYZExercise() {
  // Entferne nur die falschen Karten aus der Matrix
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (xyzMatrix.value[r][c] && xyzMatrix.value[r][c].code !== correctMatrix[r][c])
        xyzMatrix.value[r][c] = null
  resetXYZAvailableCards()
  selectedCardIndex.value = null
  xyzFeedback.show = false
}

const selectedCardIndex = ref(null)
function selectCard(idx) {
  if (xyzAvailableCards.value[idx].placed) return
  selectedCardIndex.value = idx
}
function selectMatrixCell(row, col) {
  if (selectedCardIndex.value === null) return
  if (xyzMatrix.value[row][col] !== null) return
  const card = xyzAvailableCards.value[selectedCardIndex.value]
  xyzMatrix.value[row][col] = card
  card.placed = true
  selectedCardIndex.value = null
  xyzFeedback.show = false
}
const xyzFeedback = reactive({
  show: false,
  isCorrect: false
})
function checkXYZExercise() {
  let correct = true
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      const cell = xyzMatrix.value[r][c]
      if (!cell || cell.code !== correctMatrix[r][c]) correct = false
    }
  xyzFeedback.isCorrect = correct
  xyzFeedback.show = true
}
function matrixCellClass(row, col) {
  if (xyzFeedback.show && xyzMatrix.value[row][col]) {
    const cell = xyzMatrix.value[row][col]
    const code = cell.code
    if (code === correctMatrix[row][col]) return 'matrix-cell-correct'
    else return 'matrix-cell-incorrect'
  }
  return 'matrix-cell'
}
onMounted(() => {
  resetXYZAvailableCards()
})
</script>

<style scoped>
/* Zeitstrahl vertikal */
.steps-vertical {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.2rem;
  min-width: 170px;
}
.step {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0.2rem;
  transition: background 0.2s;
}
.step-number {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.18rem;
  margin-right: 16px;
  border: 2px solid #dee2e6;
  color: #6c757d;
}
.step.active .step-number {
  background: #0d6efd;
  color: #fff;
  border-color: #0d6efd;
}
.step.completed .step-number {
  background: #198754;
  color: #fff;
  border-color: #198754;
}
.step-title {
  font-size: 1.05rem;
  font-weight: 400;
  color: #34495e;
}
.step.active .step-title { color: #0d6efd; font-weight: 600; }
.step.completed .step-title { color: #198754; }

/* Tooltip Verbesserungen */
.step-tooltip {
  position: relative;
  display: inline-block;
  margin-left: 4px;
  cursor: help;
}
.step-tooltiptext {
  visibility: hidden;
  width: 190px;
  background-color: #222;
  color: #fff;
  text-align: center;
  border-radius: 7px;
  padding: 6px;
  position: absolute;
  z-index: 11;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.25s;
  font-size: 0.93em;
  pointer-events: none;
}
.step-tooltip:focus .step-tooltiptext,
.step-tooltip:hover .step-tooltiptext {
  visibility: visible;
  opacity: 1;
}

/* ABC Klassenfarben */
.abc-a { background: #ffe3e0 !important; }
.abc-b { background: #fffbe5 !important; }
.abc-c { background: #e6f8ea !important; }
.badge.bg-danger { background: #dc3545 !important; color: #fff; }
.badge.bg-warning { background: #ffc107 !important; color: #222 !important;}
.badge.bg-success { background: #198754 !important; color: #fff !important;}

.abctable th, .abctable td { vertical-align: middle; }

/* Formelcard */
.formula-card { border-radius: 10px; border: 0; box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
.formula-card .card-title { color: #0d6efd; }

/* Übung */
.exercise-section { border-left: 4px solid #0d6efd; padding-left: 1.5rem; }
.exercise-feedback { font-size: 0.92rem; margin-top: 0.15rem; }
.exercise-feedback.correct { color: #198754; }
.exercise-feedback.incorrect { color: #c0392b; }

/* XYZ Matrix */
.xyz-matrix-container { overflow-x: auto; background: white; border-radius: .5rem; padding: 1rem; }
.xyz-matrix th, .xyz-matrix td { text-align: center; min-width: 120px; height: 70px; position: relative; background: white; border: 1px solid #dee2e6; }
.matrix-cell { cursor: pointer; transition: background 0.2s; }
.matrix-cell-correct { background: #d4edda !important; }
.matrix-cell-incorrect { background: #f8d7da !important; }
.matrix-placeholder { color: #aaa; font-size: .9em; opacity: 0.6; }

.xyz-cards-pool {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}
.xyz-card {
  border: 1px solid #adb5bd;
  background: #f9f9fa;
  border-radius: 6px;
  padding: 10px 8px;
  font-size: .99em;
  color: #222;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: box-shadow .14s, background .15s;
}
.xyz-card.selected, .xyz-card:focus { background: #e3effd; border-color: #0d6efd; outline: none; }
.xyz-card[disabled] { opacity: 0.44; pointer-events: none; }

/* Responsive */
@media (max-width: 991.98px) {
  .steps-vertical { flex-direction: row; gap: 0.6rem; min-width: 0; }
  .step { flex-direction: column; margin-right: 0.6rem; }
  .step-number { margin-right: 0; margin-bottom: 0.15rem; width: 38px; height: 38px; font-size: 1.1rem; }
  .step-title { font-size: 0.95rem; }
}
@media (max-width: 600px) {
  .xyz-matrix th, .xyz-matrix td { min-width: 55px; height: 38px; font-size: .83em;}
  .xyz-card { font-size: .85em; padding: 7px; }
  .steps-vertical { flex-direction: row; gap: 0.45rem; min-width: 0; }
  .step { flex-direction: column; }
}
</style>