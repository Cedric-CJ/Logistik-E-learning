<template>
  <Transition name="page-slide-left" mode="out-in" appear>
    <div class="abcxyz-page container py-4" key="abcxyz-page">
      <h1 class="mb-4 text-center">ABC- und XYZ-Analyse</h1>

      <!-- ===== Handy‑Dreh‑Overlay ===== -->
      <Transition name="fade">
        <div
          v-if="showRotateHint"
          class="rotate-overlay"
          role="alert"
        >
          <div class="rotate-content">
            <i class="mdi mdi-rotate-orbit me-2"></i>
            <p>Drehen Sie Ihr Handy für eine bessere Darstellung!</p>
            <button
              class="btn btn-outline-light mt-3"
              @click="dismissRotationHint"
            >
              Egal, trotzdem fortfahren
            </button>
          </div>
          <button
            class="btn-close rotate-close"
            @click="dismissRotationHint"
            aria-label="Hinweis ausblenden"
          ></button>
        </div>
      </Transition>

      <div class="row mb-4 align-items-start g-4">
        <!-- ───────────── Timeline ───────────── -->
        <div class="col-lg-3 d-flex justify-content-center">
          <div class="steps-vertical">
            <div
              v-for="step in 4"
              :key="step"
              class="step"
              :class="{ active: currentStep === step, completed: currentStep > step }"
              @click="goToStep(step)"
              :tabindex="0"
              style="outline: none"
            >
              <div class="step-number">{{ step }}</div>
              <div class="step-title">{{ getStepTitle(step) }}</div>
            </div>
          </div>
        </div>

        <!-- ───────────── Tabelle ───────────── -->
        <div class="col-lg-6">
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
                      <span class="step-tooltiptext">Anzahl der Stücke</span>
                    </span>
                  </th>
                  <th>
                    STÜCKPREIS (€)
                    <span class="step-tooltip" tabindex="0">
                      <i class="mdi mdi-information"></i>
                      <span class="step-tooltiptext">Preis pro Stück</span>
                    </span>
                  </th>
                  <th :class="{ 'col-highlight': currentStep === 1 }">
                    WERT (€)
                    <span class="step-tooltip" tabindex="0">
                      <i class="mdi mdi-information"></i>
                      <span class="step-tooltiptext">WERT = MENGE × STÜCKPREIS</span>
                    </span>
                  </th>
                  <th :class="{ 'col-highlight': currentStep === 2 }">
                    ANTEIL (%)
                    <span class="step-tooltip" tabindex="0">
                      <i class="mdi mdi-information"></i>
                      <span class="step-tooltiptext">(WERT / Gesamtwert) × 100</span>
                    </span>
                  </th>
                  <th :class="{ 'col-highlight': currentStep === 3 }">
                    KUMULIERT (%)
                    <span class="step-tooltip" tabindex="0">
                      <i class="mdi mdi-information"></i>
                      <span class="step-tooltiptext">Summe der bisherigen Anteile</span>
                    </span>
                  </th>
                  <th :class="{ 'col-highlight': currentStep === 4 }">KLASSE</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in sortedProducts"
                  :key="product.id"
                  :class="rowClass(product)"
                >
                  <td>{{ product.name }}</td>
                  <!-- Menge & Preis bleiben immer sichtbar -->
                  <td>{{ product.quantity }}</td>
                  <td>{{ product.unitPrice.toLocaleString('de-DE') }}</td>

                  <!-- Werte erscheinen Schritt‑weise -->
                  <td
                    :class="{ 'col-highlight': currentStep === 1 }"
                    @click="currentStep >= 1 && showExplanation(product, 'value')"
                    class="clickable-cell"
                  >
                    {{ currentStep >= 1 ? product.value.toLocaleString('de-DE') : '–' }}
                  </td>
                  <td
                    :class="{ 'col-highlight': currentStep === 2 }"
                    @click="currentStep >= 2 && showExplanation(product, 'percentage')"
                    class="clickable-cell"
                  >
                    {{ currentStep >= 2 ? product.percentage.toFixed(1) : '–' }}
                  </td>
                  <td
                    :class="{ 'col-highlight': currentStep === 3 }"
                    @click="currentStep >= 3 && showExplanation(product, 'cumulative')"
                    class="clickable-cell"
                  >
                    {{ currentStep >= 3 ? product.cumulative.toFixed(1) : '–' }}
                  </td>
                  <td
                    @click="currentStep >= 4 && showExplanation(product, 'class')"
                    class="clickable-cell"
                  >
                    <span v-if="currentStep >= 4" class="badge" :class="getABCBadgeClass(product.abcClass)">
                      {{ product.abcClass }}
                    </span>
                    <span v-else>–</span>
                  </td>
                </tr>
                <tr class="table-secondary fw-bold">
                  <td>Gesamt</td>
                  <td>{{ totalQuantity }}</td>
                  <td></td>
                  <td>{{ currentStep >= 1 ? totalValue.toLocaleString('de-DE') : '–' }}</td>
                  <td>{{ currentStep >= 2 ? '100,0' : '–' }}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ───────────── Formel‑Kasten ───────────── -->
        <div class="col-lg-3">
          <div class="formula-card card mb-4">
            <div class="card-body">
              <h5 class="card-title">Aktueller Schritt: {{ getStepTitle(currentStep) }}</h5>
              <div class="formula-content">
                <div v-if="currentStep === 1">
                  <p>Berechnung des Wertes (W):</p>
                  <p class="formula">
                    W = Menge × Stückpreis
                  </p>
                </div>
                <div v-else-if="currentStep === 2">
                  <p>Berechnung des Anteils (P):</p>
                  <p class="formula">
                    P = (W / Gesamtwert) × 100&nbsp;%
                  </p>
                </div>
                <div v-else-if="currentStep === 3">
                  <p>Kumulierung der Anteile (K):</p>
                  <p class="formula">K = Σ&nbsp;P</p>
                </div>
                <div v-else>
                  <p>Klassifizierung nach K:</p>
                  <ul class="mb-0">
                    <li>A: K ≤ 80&nbsp;%</li>
                    <li>B: 80&nbsp;% &lt; K ≤ 95&nbsp;%</li>
                    <li>C: K &gt; 95&nbsp;%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Erklärungstexte ===== -->
      <div class="explanation-section mt-4">
        <div v-if="currentStep === 1" class="explanation-card">
          <h4>ABC-Analyse</h4>
          <p>Die ABC-Analyse ist eine Methode zur Priorisierung von Objekten nach ihrer Bedeutung. Sie wird häufig in der Materialwirtschaft und im Bestandsmanagement eingesetzt, um den Fokus auf die wichtigsten Güter zu legen.</p>
          <p>Die Klassifizierung erfolgt nach dem Wertanteil am Gesamtbestand:</p>
          <ul>
            <li><strong>Klasse A (hohe Bedeutung):</strong> 20% der Artikel machen 80% des Werts aus</li>
            <li><strong>Klasse B (mittlere Bedeutung):</strong> 30% der Artikel machen 15% des Werts aus</li>
            <li><strong>Klasse C (geringe Bedeutung):</strong> 50% der Artikel machen 5% des Werts aus</li>
          </ul>
        </div>

        <div v-if="currentStep === 4" class="explanation-card">
          <h4>XYZ-Analyse</h4>
          <p>Die XYZ-Analyse klassifiziert Artikel nach ihrer Verbrauchsstruktur und -stabilität. Sie wird oft mit der ABC-Analyse kombiniert, um eine umfassende Materialanalyse durchzuführen.</p>
          <p>Die Klassifizierung erfolgt nach dem Verbrauchsverhalten:</p>
          <ul>
            <li><strong>Klasse X (konstanter Verbrauch):</strong> Geringe Schwankungen, gute Prognosegenauigkeit</li>
            <li><strong>Klasse Y (schwankender Verbrauch):</strong> Mittlere Schwankungen, mäßige Prognosegenauigkeit</li>
            <li><strong>Klasse Z (unregelmäßiger Verbrauch):</strong> Starke Schwankungen, schlechte Prognosegenauigkeit</li>
          </ul>
        </div>
      </div>

      <!-- ===== Erklärung‑Overlay für Zell‑Klick ===== -->
      <Transition name="fade">
        <div v-if="explain.visible" class="explain-overlay" role="dialog">
          <div class="explain-card">
            <h5 class="mb-3">{{ explain.title }}</h5>
            <p class="mb-3">{{ explain.text }}</p>
            
            <div v-for="(detail, index) in explain.details" :key="index" class="explain-detail mb-3">
              <h6 class="fw-bold text-primary">{{ detail.title }}</h6>
              <p class="mb-1">{{ detail.text }}</p>
              <p v-if="detail.example" class="text-muted small bg-light p-2 rounded">
                <i class="mdi mdi-calculator me-1"></i> {{ detail.example }}
              </p>
            </div>
            
            <button class="btn btn-primary mt-2" @click="explain.visible = false">
              <i class="mdi mdi-check me-1"></i> Verstanden
            </button>
          </div>
        </div>
      </Transition>

      <!-- ===================== ÜBUNG ===================== -->
      <div class="exercise-section mt-5">
        <h5>Übung: Fehlende Werte berechnen</h5>
        <div class="table-responsive">
          <table class="table table-sm table-bordered text-center">
          <thead class="table-light">
            <tr>
              <th>Produkt</th>
              <th>Menge</th>
              <th>Stückpreis (€)</th>
              <th>Wert (€)</th>
              <th>Anteil (%)
                <span class="step-tooltip" tabindex="0">
                  <i class="mdi mdi-information"></i>
                  <span class="step-tooltiptext">(Wert / Gesamtwert) × 100</span>
                </span>
              </th>
              <th>Kumuliert (%)
                <span class="step-tooltip" tabindex="0">
                  <i class="mdi mdi-information"></i>
                  <span class="step-tooltiptext">Summe der bisherigen Anteile</span>
                </span>
              </th>
              <th>Klasse
                <span class="step-tooltip" tabindex="0">
                  <i class="mdi mdi-information"></i>
                  <span class="step-tooltiptext">A: ≤80%, B: 80-95%, C: >95%</span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in exerciseRows" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.quantity }}</td>
              <td>{{ row.unitPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
              <td>
                <div class="position-relative">
                  <input
                    v-if="row.missing"
                    type="text"
                    v-model="exerciseState.userInputs[`value_${row.id}`]"
                    :class="{
                      'form-control form-control-sm d-inline-block w-auto': true,
                      'is-invalid': exerciseState.isCorrect === false && !row.isCorrect,
                      'is-valid': exerciseState.isCorrect === false && row.isCorrect
                    }"
                  />
                  <span v-else>{{ row.value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                  <div v-if="exerciseState.isCorrect === false && !row.isCorrect" class="invalid-feedback d-block">
                    Richtig wäre: {{ row.value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €
                  </div>
                </div>
              </td>
              <td>
                <div class="position-relative">
                  <input
                    type="text"
                    v-model="exerciseState.userInputs[`percentage_${row.id}`]"
                    :class="{
                      'form-control form-control-sm d-inline-block w-auto': true,
                      'is-invalid': exerciseState.isCorrect === false && !row.percentageCorrect,
                      'is-valid': exerciseState.isCorrect === false && row.percentageCorrect
                    }"
                  />
                  <div v-if="exerciseState.isCorrect === false && !row.percentageCorrect" class="invalid-feedback d-block">
                    Richtig wäre: {{ row.percentage.toFixed(1) }} %
                  </div>
                </div>
              </td>
              <td>
                <div class="position-relative">
                  <input
                    type="text"
                    v-model="exerciseState.userInputs[`cumulative_${row.id}`]"
                    :class="{
                      'form-control form-control-sm d-inline-block w-auto': true,
                      'is-invalid': exerciseState.isCorrect === false && !row.cumulativeCorrect,
                      'is-valid': exerciseState.isCorrect === false && row.cumulativeCorrect
                    }"
                  />
                  <div v-if="exerciseState.isCorrect === false && !row.cumulativeCorrect" class="invalid-feedback d-block">
                    Richtig wäre: {{ row.cumulative.toFixed(1) }} %
                  </div>
                </div>
              </td>
              <td>
                <div class="position-relative">
                  <input
                    type="text"
                    v-model="exerciseState.userInputs[`class_${row.id}`]"
                    :class="{
                      'form-control form-control-sm d-inline-block w-auto': true,
                      'is-invalid': exerciseState.isCorrect === false && !row.classCorrect,
                      'is-valid': exerciseState.isCorrect === false && row.classCorrect
                    }"
                  />
                  <div v-if="exerciseState.isCorrect === false && !row.classCorrect" class="invalid-feedback d-block">
                    Richtig wäre: {{ row.abcClass }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <div class="mt-3">
          <button class="btn btn-primary me-2" @click="checkAnswers">Prüfen</button>
          <button class="btn btn-outline-secondary" @click="resetExercise">Zurücksetzen</button>
        </div>

        <div v-if="exerciseState.isCorrect === true" class="alert alert-success mt-3">
          Alle Antworten sind korrekt! Gut gemacht.
        </div>
        <div v-else-if="exerciseState.isCorrect === false" class="alert alert-danger mt-3">
          Einige Felder sind noch falsch. Versuchen Sie es erneut.
        </div>
      </div>

      <!-- XYZ-Matrix -->
      <div class="exercise-section xyz-section mt-5 pt-4 border-top">
        <h3 class="h4 mb-3">Interaktive Übung: ABC-XYZ-Matrix</h3>
        <div class="alert alert-info">
          <h5 class="alert-heading">So funktioniert's:</h5>
          <ol class="mb-0">
            <li>Klicke auf eine Karte rechts, um sie auszuwählen (wird blau markiert)</li>
            <li>Klicke dann auf ein Feld in der Matrix, um die Karte dort abzulegen</li>
            <li>Korrekterweise zugeordnete Karten bleiben auch nach dem Zurücksetzen erhalten</li>
            <li>Klicke auf "Überprüfen" um deine Lösung zu prüfen</li>
          </ol>
        </div>
        <p class="mt-3 mb-2">
          <strong>Aufgabe:</strong> Ordne die Beschreibungen den richtigen Feldern in der Matrix zu.
        </p>
        <div class="alert alert-light mb-3">
          <h6 class="fw-bold">Hinweis zur ABC-XYZ-Matrix:</h6>
          <p class="mb-1">Die Kombination aus ABC- und XYZ-Analyse hilft bei der Priorisierung von Artikeln:</p>
          <ul class="mb-0">
            <li><strong>A-Artikel</strong> haben den höchsten Wertanteil</li>
            <li><strong>X-Artikel</strong> haben eine stabile Nachfrage</li>
            <li>Ziel ist es, für jede Kombination passende Beschreibungen zuzuordnen</li>
          </ul>
        </div>
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
                    <td 
                      v-for="(col, colIndex) in 3" 
                      :key="colIndex"
                      :class="[
                        'matrix-cell',
                        matrixCellClass(rowIndex, colIndex),
                        { 
                          'matrix-cell-selected': isCellSelected(rowIndex, colIndex),
                          'matrix-cell-correct': xyzMatrix[rowIndex][colIndex]?.isCorrect,
                          'matrix-cell-incorrect': xyzFeedback.show && !isCellCorrect(rowIndex, colIndex)
                        }
                      ]"
                      @click="selectMatrixCell(rowIndex, colIndex)">
                      <div v-if="xyzMatrix[rowIndex][colIndex] !== null" class="matrix-cell-content">
                        {{ xyzMatrix[rowIndex][colIndex].text }}
                        <div v-if="xyzFeedback.show && !isCellCorrect(rowIndex, colIndex)" class="matrix-feedback">
                          <i class="mdi mdi-close-circle text-danger"></i>
                        </div>
                        <div v-else-if="xyzFeedback.show" class="matrix-feedback">
                          <i class="mdi mdi-check-circle text-success"></i>
                        </div>
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
              <div class="card-body p-0">
                <div class="xyz-cards-container bg-light rounded p-3 h-100 d-flex flex-column">
                  <h5 class="mb-3">Verfügbare Karten</h5>
                  <div class="xyz-cards-pool flex-grow-1">
                    <button 
                      v-for="(card, idx) in xyzAvailableCards.filter(c => !c.placed)" 
                      :key="card.code"
                      class="xyz-card"
                      :class="{
                        selected: selectedCardIndex === xyzAvailableCards.indexOf(card),
                        'xyz-card-correct': card.isCorrect
                      }"
                      @click="selectCard(xyzAvailableCards.indexOf(card))">
                      {{ card.text }}
                    </button>
                  </div>
                  <button class="btn btn-primary btn-sm" @click="checkXYZExercise">
                    <i class="mdi mdi-check me-1"></i> Überprüfen
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
      </div>
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
const showRotateHint = ref(false)

onMounted(() => {
  const rotationHintDismissed = localStorage.getItem('rotationHintDismissed') === 'true'
  
  const updateMobile = () => {
    const wasLandscape = window.innerWidth > window.innerHeight
    isMobile.value = window.innerWidth < 992
    
    if (isMobile.value && !rotationHintDismissed) {
      // Show hint only if in portrait mode and not previously dismissed
      showRotateHint.value = !wasLandscape
    } else {
      showRotateHint.value = false
    }
  }
  
  updateMobile()
  window.addEventListener('resize', updateMobile)
  window.addEventListener('orientationchange', updateMobile)
  
  // Cleanup
  return () => {
    window.removeEventListener('resize', updateMobile)
    window.removeEventListener('orientationchange', updateMobile)
  }
})

const currentStep = ref(1)
const goToStep = (step) => (currentStep.value = step)
const getStepTitle = (step) => ['Wert berechnen', 'Anteil berechnen', 'Kumulierte Werte', 'Klassifizierung'][step - 1]
const products = reactive([
  { id: 1, name: 'Laptop',       quantity: 15, unitPrice: 1200 },
  { id: 2, name: 'Monitor',      quantity: 30, unitPrice: 350  },
  { id: 3, name: 'Tastatur',     quantity: 50, unitPrice: 80   },
  { id: 4, name: 'Drucker',      quantity: 8,  unitPrice: 450  },
  { id: 5, name: 'Lautsprecher', quantity: 25, unitPrice: 120  },
  { id: 6, name: 'Maus',         quantity: 60, unitPrice: 25   }
])

const sortedProducts = computed(() => {
  const arr = [...products]
  arr.forEach((p) => (p.value = p.quantity * p.unitPrice))
  arr.sort((a, b) => b.value - a.value)
  const total = arr.reduce((sum, p) => sum + p.value, 0)
  let cumulative = 0
  arr.forEach((p) => {
    p.percentage = (p.value / total) * 100
    cumulative += p.percentage
    p.cumulative = cumulative
    if (p.cumulative <= 80.1) p.abcClass = 'A'
    else if (p.cumulative <= 95) p.abcClass = 'B'
    else p.abcClass = 'C'
  })
  return arr
})

const totalValue = computed(() => sortedProducts.value.reduce((s, p) => s + p.value, 0))
const totalQuantity = computed(() => sortedProducts.value.reduce((s, p) => s + p.quantity, 0))

const getABCBadgeClass = (c) => (c === 'A' ? 'bg-success' : c === 'B' ? 'bg-warning text-dark' : 'bg-danger')
const rowClass = (product) => {
  if (currentStep.value < 4) return ''
  return product.abcClass === 'A' ? 'abc-a' : product.abcClass === 'C' ? 'abc-c' : 'abc-b'
}

const explain = reactive({ visible: false, title: '', text: '', details: [] })

const getExplanationDetails = (product, field) => {
  const details = []
  
  if (field === 'value') {
    details.push({
      title: 'Berechnung des Werts',
      text: `Anzahl × Stückpreis = Wert`,
      example: `${product.quantity} × ${product.unitPrice.toLocaleString('de-DE')} € = ${product.value.toLocaleString('de-DE')} €`
    })
    details.push({
      title: 'Beispiel',
      text: `Bei ${product.name}: ${product.quantity} Stück × ${product.unitPrice.toLocaleString('de-DE')} €/Stück = ${product.value.toLocaleString('de-DE')} €`
    })
  } 
  else if (field === 'percentage') {
    details.push({
      title: 'Berechnung des Anteils',
      text: `(Wert des Artikels / Gesamtwert) × 100`,
      example: `(${product.value.toLocaleString('de-DE')} € / ${totalValue.value.toLocaleString('de-DE')} €) × 100 = ${product.percentage.toFixed(1)} %`
    })
    details.push({
      title: 'Bedeutung',
      text: `Der prozentuale Anteil zeigt, wie viel Prozent des Gesamtwerts auf diesen Artikel entfällt.`
    })
  }
  else if (field === 'cumulative') {
    const prev = (product.cumulative - product.percentage).toFixed(1)
    details.push({
      title: 'Berechnung der kumulierten Werte',
      text: `Kumulierter Wert = Summe der vorherigen Anteile + aktueller Anteil`,
      example: `${prev} % + ${product.percentage.toFixed(1)} % = ${product.cumulative.toFixed(1)} %`
    })
    details.push({
      title: 'Warum fängt man bei 0% an?',
      text: `Die kumulierte Summe beginnt bei 0%, weil noch kein Artikel betrachtet wurde. Bei jedem Schritt addieren wir den prozentualen Anteil des aktuellen Artikels zur laufenden Summe.`
    })
  }
  else if (field === 'class') {
    details.push({
      title: 'Klassifizierung',
      text: `Basierend auf dem kumulierten Wertanteil wird die Klasse bestimmt:`,
      example: `Kumulierter Wert = ${product.cumulative.toFixed(1)}% → Klasse ${product.abcClass}`
    })
    details.push({
      title: 'Klassengrenzen',
      text: `• A: 0-80%\n• B: 80-95%\n• C: 95-100%`
    })
  }
  
  return details
}

const showExerciseExplanation = (row, field) => {
  // Nur Erklärungen anzeigen, wenn bereits auf "Prüfen" geklickt wurde
  if (!exerciseState.showExplanations) return
  
  const totalValue = exerciseRows.reduce((sum, r) => sum + r.value, 0)
  const sortedRows = [...exerciseRows].sort((a, b) => b.value - a.value)
  const rowIndex = sortedRows.findIndex(r => r.id === row.id)
  const previousCumulative = rowIndex > 0 ? sortedRows[rowIndex - 1].cumulative : 0
  
  explain.title = `Erklärung: ${row.name} - ${field}`
  
  switch(field) {
    case 'value':
      explain.text = `Berechnung des Wertes`
      explain.details = [
        `Menge: ${row.quantity} Stück`,
        `Stückpreis: ${row.unitPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`,
        `Wert = Menge × Stückpreis`,
        `= ${row.quantity} × ${row.unitPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `= ${row.value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
      ]
      break
      
    case 'percentage':
      explain.text = `Berechnung des Prozentanteils`
      explain.details = [
        `Wert: ${row.value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`,
        `Gesamtwert: ${totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`,
        `Anteil = (Wert / Gesamtwert) × 100`,
        `= (${row.value} / ${totalValue}) × 100`,
        `= ${row.percentage.toFixed(1)} %`
      ]
      break
      
    case 'cumulative':
      explain.text = `Berechnung des kumulierten Anteils`
      explain.details = [
        `Eigener Anteil: ${row.percentage.toFixed(1)} %`,
        `Vorherige kumulierte Anteile: ${previousCumulative.toFixed(1)} %`,
        `Kumulierter Anteil = Vorherige kumulierte Anteile + Eigener Anteil`,
        `= ${previousCumulative.toFixed(1)} + ${row.percentage.toFixed(1)}`,
        `= ${row.cumulative.toFixed(1)} %`
      ]
      break
      
    case 'class':
      explain.text = `Bestimmung der ABC-Klasse`
      explain.details = [
        `Kumulierter Anteil: ${row.cumulative.toFixed(1)} %`,
        `Klassifizierung: ${row.abcClass}`,
        `- A: kumulierter Wert ≤ 80%`,
        `- B: > 80% bis ≤ 95%`,
        `- C: > 95% bis 100%`,
        `Da ${row.cumulative.toFixed(1)}% ${row.abcClass === 'A' ? '≤ 80%' : row.abcClass === 'B' ? 'zwischen 80% und 95%' : '> 95%'} liegt, ist die Klasse ${row.abcClass}.`
      ]
      break
  }
  
  explain.visible = true
}

const showExplanation = (product, field) => {
  explain.details = getExplanationDetails(product, field)
  
  if (field === 'value') {
    explain.title = `Wert von ${product.name}`
    explain.text = `Berechnung des Gesamtwerts für ${product.name}`
  } else if (field === 'percentage') {
    explain.title = `Anteil von ${product.name} am Gesamtwert`
    explain.text = `Berechnung des prozentualen Anteils`
  } else if (field === 'cumulative') {
    explain.title = `Kumulierter Wert (${product.name})`
    explain.text = `Berechnung der kumulierten Prozentwerte`
  } else if (field === 'class') {
    explain.title = `Klassifizierung: ${product.abcClass}`
    explain.text = `Bestimmung der ABC-Klasse`
  }
  
  explain.visible = true
}

const calculateValues = (rows) => {
  // Calculate total value for percentages
  const totalValue = rows.reduce((sum, row) => sum + row.value, 0)
  
  // Calculate percentages and cumulative values
  let cumulative = 0
  return rows
    .sort((a, b) => b.value - a.value) // Sort by value in descending order
    .map(row => {
      const percentage = (row.value / totalValue) * 100
      cumulative += percentage
      
      return {
        ...row,
        percentage: parseFloat(percentage.toFixed(1)),
        cumulative: parseFloat(cumulative.toFixed(1)),
        // 80/15/5 Regel: A ≤ 80%, B ≤ 95%, C > 95%
        abcClass: cumulative <= 80 ? 'A' : cumulative <= 95 ? 'B' : 'C'
      }
    })
}

const initialExerciseRows = [
  { 
    id: 11, 
    name: 'Router',    
    quantity: 12, 
    unitPrice: 60,  
    value: 720,  
    missing: true,
    missingPercentage: true,
    missingCumulative: true,
    missingClass: true
  },
  { 
    id: 12, 
    name: 'USB-Stick', 
    quantity: 50, 
    unitPrice: 12,  
    value: 600,  
    missing: true,  // Changed to true for user calculation
    missingPercentage: true,
    missingCumulative: true,
    missingClass: true
  },
  { 
    id: 13, 
    name: 'Switch',    
    quantity: 10, 
    unitPrice: 90,  
    value: 900,  
    missing: true,
    missingPercentage: true,
    missingCumulative: true,
    missingClass: true
  },
  { 
    id: 14, 
    name: 'Beamer',    
    quantity: 3,  
    unitPrice: 350, 
    value: 1050,  
    missing: true,  // Changed to true for user calculation
    missingPercentage: true,
    missingCumulative: true,
    missingClass: true
  },
  { 
    id: 15, 
    name: 'Headset',   
    quantity: 20, 
    unitPrice: 25,  
    value: 500,  
    missing: true,
    missingPercentage: true,
    missingCumulative: true,
    missingClass: true
  }
]

const exerciseRows = calculateValues(initialExerciseRows)
const exerciseState = reactive({ 
  userInputs: {}, 
  isCorrect: null,
  showExplanations: false
})
const parseNumberDe = (str) => {
  if (typeof str === 'number') return str
  if (!str) return NaN
  return parseFloat(str.replace(/\./g, '').replace(',', '.'))
}
const checkAnswers = () => {
  let allRight = true
  
  // First, check all value inputs and update the calculations if needed
  exerciseRows.forEach((row) => {
    if (row.missing) {
      const val = parseNumberDe(exerciseState.userInputs[`value_${row.id}`] || '')
      row.isCorrect = !isNaN(val) && Math.abs(val - row.value) < 0.05
    } else {
      row.isCorrect = true
    }
  })
  
  // Recalculate percentages and cumulative values based on current inputs
  const rowsWithUpdatedValues = exerciseRows.map(row => ({
    ...row,
    // Use user input if available and valid, otherwise use the correct value
    value: row.missing && exerciseState.userInputs[`value_${row.id}`] 
      ? parseNumberDe(exerciseState.userInputs[`value_${row.id}`]) 
      : row.value
  }))
  
  // Sort by value in descending order and recalculate percentages and cumulative values
  const sortedAndCalculated = calculateValues(rowsWithUpdatedValues)
  
  // Update the exercise rows with new calculations
  exerciseRows.forEach((row, index) => {
    const calculatedRow = sortedAndCalculated.find(r => r.id === row.id)
    if (!calculatedRow) return
    
    // Update calculated values
    row.percentage = calculatedRow.percentage
    row.cumulative = calculatedRow.cumulative
    row.abcClass = calculatedRow.abcClass
    
    // Check percentage input (allow 0.1% tolerance)
    const percentageInput = parseNumberDe(exerciseState.userInputs[`percentage_${row.id}`] || '')
    row.percentageCorrect = !isNaN(percentageInput) && Math.abs(percentageInput - row.percentage) < 0.1
    
    // Check cumulative percentage input (allow 0.1% tolerance)
    const cumulativeInput = parseNumberDe(exerciseState.userInputs[`cumulative_${row.id}`] || '')
    row.cumulativeCorrect = !isNaN(cumulativeInput) && Math.abs(cumulativeInput - row.cumulative) < 0.1
    
    // Check class input (case insensitive)
    const classInput = (exerciseState.userInputs[`class_${row.id}`] || '').toUpperCase().trim()
    row.classCorrect = classInput === row.abcClass
    
    // Update overall correctness
    if ((row.missing && !row.isCorrect) || 
        (row.missingPercentage && !row.percentageCorrect) || 
        (row.missingCumulative && !row.cumulativeCorrect) || 
        (row.missingClass && !row.classCorrect)) {
      allRight = false
    }
  })
  
  exerciseState.isCorrect = allRight
  exerciseState.showExplanations = true
}
const resetExercise = () => {
  exerciseState.userInputs = {}
  exerciseState.isCorrect = null
  exerciseState.showExplanations = false
}

const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const xyzRowLabels = ['A', 'B', 'C']
const xyzAvailableCards = reactive(shuffleArray([
  { code: 'AX', text: 'Hoher Wert, gleichmäßige Nachfrage', placed: false },
  { code: 'AY', text: 'Hoher Wert, mittlere Nachfragevariabilität', placed: false },
  { code: 'AZ', text: 'Hoher Wert, unregelmäßige Nachfrage', placed: false },
  { code: 'BX', text: 'Mittlerer Wert, gleichmäßige Nachfrage', placed: false },
  { code: 'BY', text: 'Mittlerer Wert, mittlere Nachfragevariabilität', placed: false },
  { code: 'BZ', text: 'Mittlerer Wert, unregelmäßige Nachfrage', placed: false },
  { code: 'CX', text: 'Geringer Wert, gleichmäßige Nachfrage', placed: false },
  { code: 'CY', text: 'Geringer Wert, mittlere Nachfragevariabilität', placed: false },
  { code: 'CZ', text: 'Geringer Wert, unregelmäßige Nachfrage', placed: false }
]))
const selectedCardIndex = ref(null)
const xyzMatrix = reactive(Array.from({ length: 3 }, () => Array(3).fill(null)))
const xyzFeedback = reactive({ show: false, isCorrect: false })

const resetXYZAvailableCards = () => {
  xyzAvailableCards.forEach(card => {
    if (!card.isCorrect) {
      card.placed = false
    }
  })
  
  // Clear the matrix, but keep correct answers
  for (let i = 0; i < xyzMatrix.length; i++) {
    for (let j = 0; j < xyzMatrix[i].length; j++) {
      const cell = xyzMatrix[i][j]
      if (cell && !cell.isCorrect) {
        xyzMatrix[i][j] = null
      }
    }
  }
  
  selectedCardIndex.value = null
  xyzFeedback.show = false
}
const selectCard = (idx) => { selectedCardIndex.value = idx }
const selectMatrixCell = (row, col) => {
  const selectedCard = selectedCardIndex.value !== null 
    ? xyzAvailableCards[selectedCardIndex.value] 
    : null
  const targetCell = xyzMatrix[row][col]
  
  // If we have a selected card and the target cell is empty or contains a non-correct card
  if (selectedCard && (!targetCell || !targetCell.isCorrect)) {
    // If the card is already placed somewhere else, remove it from there
    if (selectedCard.placed) {
      for (let i = 0; i < xyzMatrix.length; i++) {
        for (let j = 0; j < xyzMatrix[i].length; j++) {
          if (xyzMatrix[i][j] === selectedCard) {
            xyzMatrix[i][j] = null
            break
          }
        }
      }
    }
    
    // If target cell has a card, return it to the available cards
    if (targetCell && !targetCell.isCorrect) {
      targetCell.placed = false
    }
    
    // Place the selected card
    xyzMatrix[row][col] = selectedCard
    selectedCard.placed = true
    selectedCardIndex.value = null
  } 
  // If clicking on a placed card, select it for moving
  else if (targetCell && !targetCell.isCorrect) {
    selectedCardIndex.value = xyzAvailableCards.findIndex(card => card === targetCell)
  }
}
const matrixCellClass = (row, col) => {
  const classes = ['matrix-cell']
  if (xyzFeedback.show) {
    const cell = xyzMatrix[row][col]
    const expected = xyzRowLabels[row] + ['X','Y','Z'][col]
    if (cell && cell.code === expected) classes.push('matrix-cell-correct')
    else classes.push('matrix-cell-incorrect')
  }
  return classes.join(' ')
}
const dismissRotationHint = () => {
  showRotateHint.value = false
  localStorage.setItem('rotationHintDismissed', 'true')
}

const checkXYZExercise = () => {
  let allCorrect = true
  
  xyzAvailableCards.forEach(card => {
    card.isCorrect = false
  })
  
  // Check each cell
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = xyzMatrix[i][j]
      const expected = xyzRowLabels[i] + ['X','Y','Z'][j]
      
      if (cell) {
        cell.isCorrect = cell.code === expected
        if (!cell.isCorrect) allCorrect = false
      } else {
        allCorrect = false
      }
    }
  }
  
  xyzFeedback.isCorrect = allCorrect
  xyzFeedback.show = true
  
  // If everything is correct, mark all placed cards as correct
  if (allCorrect) {
    xyzAvailableCards.forEach(card => {
      if (card.placed) card.isCorrect = true
    })
  }
}
const isCellSelected = (row, col) => {
  if (selectedCardIndex.value === null) return false
  const card = xyzAvailableCards[selectedCardIndex.value]
  return xyzMatrix[row][col] === card
}

const isCellCorrect = (row, col) => {
  const cell = xyzMatrix[row][col]
  if (!cell) return false
  
  const expectedCode = xyzRowLabels[row] + ['X','Y','Z'][col]
  return cell.code === expectedCode
}

const resetXYZExercise = () => resetXYZAvailableCards()

onMounted(() => {
  resetXYZAvailableCards()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
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
.abc-a { background: #ffe3e0 !important; }
.abc-b { background: #fffbe5 !important; }
.abc-c { background: #e6f8ea !important; }
.badge.bg-danger { background: #dc3545 !important; color: #fff; }
.badge.bg-warning { background: #ffc107 !important; color: #222 !important;}
.badge.bg-success { background: #198754 !important; color: #fff !important;}
.abctable th, .abctable td { vertical-align: middle; }
.formula-card { border-radius: 10px; border: 0; box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
.formula-card .card-title { color: #0d6efd; }
.exercise-section { border-left: 4px solid #0d6efd; padding-left: 1.5rem; }
.exercise-feedback { font-size: 0.92rem; margin-top: 0.15rem; }
.exercise-feedback.correct { color: #198754; }
.exercise-feedback.incorrect { color: #c0392b; }
.xyz-matrix-container { overflow-x: auto; background: white; border-radius: .5rem; padding: 1rem; }
.xyz-matrix th, .xyz-matrix td { text-align: center; min-width: 120px; height: 70px; position: relative; background: white; border: 1px solid #dee2e6; }
.matrix-cell {
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  min-height: 100px;
  vertical-align: middle;
}
.matrix-cell-content {
  padding: 0.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.matrix-feedback {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  font-size: 1.25rem;
}
.matrix-cell-selected {
  box-shadow: 0 0 0 2px #0d6efd inset;
  background-color: rgba(13, 110, 253, 0.05);
}
.matrix-cell-correct {
  background-color: rgba(40, 167, 69, 0.1);
  border-color: #28a745;
}
.matrix-cell-incorrect {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: #dc3545;
}
.xyz-card-placed {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  color: #28a745;
  font-size: 0.8em;
}
.xyz-card-disabled {
  opacity: 0.6;
  position: relative;
}
.xyz-card-correct {
  background-color: #d4edda;
  border-color: #28a745;
}
.xyz-card-correct::after {
  background: rgba(40, 167, 69, 0.1) !important;
}
.xyz-cards-pool {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: thin;
  margin-bottom: 0;
}
.xyz-cards-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.xyz-matrix-exercise {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
.xyz-card {
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.9em;
  line-height: 1.3;
  color: #212529;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  min-height: auto;
  display: block;
  width: 100%;
  white-space: normal;
  text-overflow: ellipsis;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.xyz-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-color: #0d6efd;
  z-index: 1;
}
.xyz-card.selected {
  background-color: #e7f1ff;
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
}
.xyz-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 110, 253, 0.1);
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}
.xyz-card:hover::after {
  opacity: 1;
}
.xyz-card.correct {
  background: #d4edda;
  border-color: #28a745;
}
.xyz-card.selected {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-color: #0d6efd;
  background: #e3effd;
}
.xyz-card.correct::after {
  background: rgba(40, 167, 69, 0.1);
}
.xyz-card.selected, .xyz-card:focus { background: #e3effd; border-color: #0d6efd; outline: none; }
.xyz-card[disabled] { opacity: 0.44; pointer-events: none; }
.explanation-section {
  max-width: 100%;
  margin: 0 auto;
}
.explanation-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
}
.explanation-card h4 {
  color: #0d6efd;
  margin-bottom: 1rem;
  font-weight: 600;
}
.explanation-card p {
  margin-bottom: 1rem;
  line-height: 1.6;
}
.explanation-card ul {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
.explanation-card li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}
.rotate-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
  text-align: center;
  font-size: 1.2rem;
}
.rotate-content {
  max-width: 400px;
  margin: 0 auto;
}
.rotate-content p {
  margin: 1rem 0;
  line-height: 1.5;
}
.rotate-content .btn {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border-radius: 50px;
  transition: all 0.2s;
}
.rotate-content .btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}
.rotate-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  opacity: 0.8;
  font-size: 1.5rem;
  cursor: pointer;
}
.rotate-close:hover {
  opacity: 1;
}
.explain-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
.explain-card {
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}
.explain-detail {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.explain-detail:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.explain-card h5 {
  color: #0d6efd;
  font-weight: 600;
}
.explain-card .btn {
  min-width: 120px;
  font-weight: 500;
}
.explain-card::-webkit-scrollbar {
  width: 8px;
}
.explain-card::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.explain-card::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
.explain-card::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
@media (max-width: 991.98px) {
  .steps-vertical { 
    flex-direction: row; 
    gap: 0.6rem; 
    min-width: 0;
    width: 100%;
    justify-content: space-between;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  .step { 
    flex-direction: column; 
    align-items: center;
    min-width: 70px;
    padding: 0 0.5rem;
  }
  .step-number { 
    margin: 0 0 0.5rem 0; 
    width: 40px; 
    height: 40px; 
    font-size: 1.1rem; 
  }
  .step-title { 
    font-size: 0.8rem; 
    text-align: center;
    white-space: nowrap;
  }
}
@media (max-width: 600px) {
  .xyz-matrix th, .xyz-matrix td { min-width: 55px; height: 38px; font-size: .83em;}
  .xyz-card { font-size: .85em; padding: 7px; }
  .steps-vertical { flex-direction: row; gap: 0.45rem; min-width: 0; }
  .step { flex-direction: column; }
}
</style>