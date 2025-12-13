document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('limiting-reagent-form')
  const resultDiv = document.getElementById('result')
  const addReagentBtn = document.getElementById('add-reagent')
  const reagentsContainer = document.getElementById('reagents-container')

  let reagentCount = 2

  // Добавление нового реагента
  addReagentBtn.addEventListener('click', function () {
    reagentCount++
    const newReagent = createReagentInput(reagentCount)
    reagentsContainer.insertBefore(newReagent, addReagentBtn)
  })

  function createReagentInput(number) {
    const div = document.createElement('div')
    div.className = 'reagent-input'
    div.setAttribute('data-reagent', number)

    div.innerHTML = `
            <h4>Реагент ${number} <button type="button" class="remove-reagent" onclick="removeReagent(this)">Удалить</button></h4>
            <label>Название:</label>
            <input type="text" class="reagent-name" placeholder="Название реагента" required>
            <label>Масса (г):</label>
            <input type="number" class="reagent-mass" step="0.001" placeholder="Масса" required>
            <label>Молярная масса (г/моль):</label>
            <input type="number" class="reagent-molar-mass" step="0.001" placeholder="Молярная масса" required>
            <label>Коэффициент в уравнении:</label>
            <input type="number" class="reagent-coefficient" placeholder="Коэффициент" required>
        `

    return div
  }

  // Удаление реагента
  window.removeReagent = function (button) {
    if (reagentsContainer.querySelectorAll('.reagent-input').length > 2) {
      button.closest('.reagent-input').remove()
    } else {
      alert('Должно быть минимум 2 реагента!')
    }
  }

  // Обработка отправки формы
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    calculateLimitingReagent()
  })

  function calculateLimitingReagent() {
    try {
      // Получаем данные о реагентах
      const reagentInputs = document.querySelectorAll('.reagent-input')
      const reagents = []

      reagentInputs.forEach(input => {
        const name = input.querySelector('.reagent-name').value
        const mass = parseFloat(input.querySelector('.reagent-mass').value)
        const molarMass = parseFloat(
          input.querySelector('.reagent-molar-mass').value,
        )
        const coefficient = parseInt(
          input.querySelector('.reagent-coefficient').value,
        )

        if (!name || isNaN(mass) || isNaN(molarMass) || isNaN(coefficient)) {
          throw new Error('Заполните все поля для всех реагентов!')
        }

        const moles = mass / molarMass
        const effectiveMoles = moles / coefficient

        reagents.push({
          name,
          mass,
          molarMass,
          coefficient,
          moles,
          effectiveMoles,
        })
      })

      // Находим лимитирующий реагент
      const limitingReagent = reagents.reduce((min, reagent) =>
        reagent.effectiveMoles < min.effectiveMoles ? reagent : min,
      )

      // Получаем данные о продукте
      const productName = document.getElementById('product-name').value
      const productCoefficient = parseInt(
        document.getElementById('product-coefficient').value,
      )
      const productMolarMass = parseFloat(
        document.getElementById('product-molar-mass').value,
      )
      const actualYield = parseFloat(
        document.getElementById('actual-yield').value,
      )

      if (
        !productName ||
        isNaN(productCoefficient) ||
        isNaN(productMolarMass)
      ) {
        throw new Error('Заполните данные о продукте!')
      }

      // Рассчитываем теоретический выход
      const theoreticalMoles =
        limitingReagent.effectiveMoles * productCoefficient
      const theoreticalMass = theoreticalMoles * productMolarMass

      // Рассчитываем процент выхода если указан фактический выход
      let yieldPercent = null
      if (!isNaN(actualYield)) {
        yieldPercent = (actualYield / theoreticalMass) * 100
      }

      // Отображаем результаты
      displayResults(
        reagents,
        limitingReagent,
        theoreticalMoles,
        theoreticalMass,
        actualYield,
        yieldPercent,
        productName,
      )
    } catch (error) {
      showError(error.message)
    }
  }

  function displayResults(
    reagents,
    limitingReagent,
    theoreticalMoles,
    theoreticalMass,
    actualYield,
    yieldPercent,
    productName,
  ) {
    let html = `
            <h3>Результаты расчета</h3>
            
            <div class="calculation-step">
                <h4>1. Количество молей каждого реагента:</h4>
                <ul>
        `

    reagents.forEach(reagent => {
      html += `<li><strong>${reagent.name}:</strong> ${reagent.mass} г ÷ ${
        reagent.molarMass
      } г/моль = ${reagent.moles.toFixed(4)} моль</li>`
    })

    html += `
                </ul>
            </div>

            <div class="calculation-step">
                <h4>2. Эффективное количество молей (с учетом коэффициентов):</h4>
                <ul>
        `

    reagents.forEach(reagent => {
      html += `<li><strong>${reagent.name}:</strong> ${reagent.moles.toFixed(
        4,
      )} моль ÷ ${reagent.coefficient} = ${reagent.effectiveMoles.toFixed(
        4,
      )} эфф. моль</li>`
    })

    html += `
                </ul>
            </div>

            <div class="result-highlight">
                <h4>3. Лимитирующий реагент:</h4>
                <p><strong>${
                  limitingReagent.name
                }</strong> (наименьшее эффективное количество молей: ${limitingReagent.effectiveMoles.toFixed(
      4,
    )})</p>
            </div>

            <div class="calculation-step">
                <h4>4. Теоретический выход:</h4>
                <p>Количество молей ${productName}: ${theoreticalMoles.toFixed(
      4,
    )} моль</p>
                <p><strong>Масса ${productName}: ${theoreticalMass.toFixed(
      3,
    )} г</strong></p>
            </div>
        `

    if (yieldPercent !== null) {
      html += `
                <div class="result-highlight">
                    <h4>5. Процент выхода:</h4>
                    <p><strong>${yieldPercent.toFixed(1)}%</strong></p>
                    <p>Фактический выход: ${actualYield} г</p>
                    <p>Теоретический выход: ${theoreticalMass.toFixed(3)} г</p>
                </div>
            `
    }

    // Добавляем анализ избыточных реагентов
    html += `
            <div class="calculation-step">
                <h4>6. Избыточные реагенты:</h4>
                <ul>
        `

    reagents.forEach(reagent => {
      if (reagent.name !== limitingReagent.name) {
        const usedMoles = limitingReagent.effectiveMoles * reagent.coefficient
        const excessMoles = reagent.moles - usedMoles
        const excessMass = excessMoles * reagent.molarMass
        html += `<li><strong>${
          reagent.name
        }:</strong> избыток ${excessMoles.toFixed(
          4,
        )} моль (${excessMass.toFixed(3)} г)</li>`
      }
    })

    html += `
                </ul>
            </div>
        `

    resultDiv.innerHTML = html
    resultDiv.classList.add('show')
  }

  function showError(message) {
    resultDiv.innerHTML = `<div class="error">${message}</div>`
    resultDiv.classList.add('show')
  }

  // Загрузка примеров
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('load-example')) {
      const exampleNumber = e.target.getAttribute('data-example')
      loadExample(exampleNumber)
    }
  })

  function loadExample(exampleNumber) {
    // Очищаем форму
    form.reset()

    // Удаляем лишние реагенты, оставляем только 2
    const reagentInputs = document.querySelectorAll('.reagent-input')
    for (let i = 2; i < reagentInputs.length; i++) {
      reagentInputs[i].remove()
    }
    reagentCount = 2

    switch (exampleNumber) {
      case '1':
        // Пример 1: Синтез аммиака
        document.getElementById('reaction-equation').value = 'N₂ + 3H₂ → 2NH₃'

        // Реагент 1 - N₂
        const reagent1 = document.querySelector('[data-reagent="1"]')
        reagent1.querySelector('.reagent-name').value = 'N₂'
        reagent1.querySelector('.reagent-mass').value = '28'
        reagent1.querySelector('.reagent-molar-mass').value = '28'
        reagent1.querySelector('.reagent-coefficient').value = '1'

        // Реагент 2 - H₂
        const reagent2 = document.querySelector('[data-reagent="2"]')
        reagent2.querySelector('.reagent-name').value = 'H₂'
        reagent2.querySelector('.reagent-mass').value = '9'
        reagent2.querySelector('.reagent-molar-mass').value = '2'
        reagent2.querySelector('.reagent-coefficient').value = '3'

        // Продукт
        document.getElementById('product-name').value = 'NH₃'
        document.getElementById('product-coefficient').value = '2'
        document.getElementById('product-molar-mass').value = '17'
        break

      case '2':
        // Пример 2: Горение метана
        document.getElementById('reaction-equation').value =
          'CH₄ + 2O₂ → CO₂ + 2H₂O'

        // Реагент 1 - CH₄
        const reagent1_2 = document.querySelector('[data-reagent="1"]')
        reagent1_2.querySelector('.reagent-name').value = 'CH₄'
        reagent1_2.querySelector('.reagent-mass').value = '16'
        reagent1_2.querySelector('.reagent-molar-mass').value = '16'
        reagent1_2.querySelector('.reagent-coefficient').value = '1'

        // Реагент 2 - O₂
        const reagent2_2 = document.querySelector('[data-reagent="2"]')
        reagent2_2.querySelector('.reagent-name').value = 'O₂'
        reagent2_2.querySelector('.reagent-mass').value = '96'
        reagent2_2.querySelector('.reagent-molar-mass').value = '32'
        reagent2_2.querySelector('.reagent-coefficient').value = '2'

        // Продукт
        document.getElementById('product-name').value = 'CO₂'
        document.getElementById('product-coefficient').value = '1'
        document.getElementById('product-molar-mass').value = '44'
        break

      case '3':
        // Пример 3: Процент выхода
        document.getElementById('reaction-equation').value = '2H₂ + O₂ → 2H₂O'

        // Реагент 1 - H₂
        const reagent1_3 = document.querySelector('[data-reagent="1"]')
        reagent1_3.querySelector('.reagent-name').value = 'H₂'
        reagent1_3.querySelector('.reagent-mass').value = '4'
        reagent1_3.querySelector('.reagent-molar-mass').value = '2'
        reagent1_3.querySelector('.reagent-coefficient').value = '2'

        // Реагент 2 - O₂
        const reagent2_3 = document.querySelector('[data-reagent="2"]')
        reagent2_3.querySelector('.reagent-name').value = 'O₂'
        reagent2_3.querySelector('.reagent-mass').value = '32'
        reagent2_3.querySelector('.reagent-molar-mass').value = '32'
        reagent2_3.querySelector('.reagent-coefficient').value = '1'

        // Продукт
        document.getElementById('product-name').value = 'H₂O'
        document.getElementById('product-coefficient').value = '2'
        document.getElementById('product-molar-mass').value = '18'
        document.getElementById('actual-yield').value = '15'
        break
    }

    // Прокручиваем к калькулятору
    document.querySelector('.calculator').scrollIntoView({ behavior: 'smooth' })
  }
})
