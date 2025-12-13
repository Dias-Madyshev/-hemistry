document.addEventListener('DOMContentLoaded', function () {
  // Управление табами
  const tabButtons = document.querySelectorAll('.tab-btn')
  const tabContents = document.querySelectorAll('.tab-content')

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab')

      // Убираем активные классы
      tabButtons.forEach(btn => btn.classList.remove('active'))
      tabContents.forEach(content => content.classList.remove('active'))

      // Добавляем активные классы
      this.classList.add('active')
      document.getElementById(targetTab).classList.add('active')
    })
  })

  // Обработчики форм
  const massForm = document.getElementById('mass-form')
  const molarityForm = document.getElementById('molarity-form')
  const massFractionForm = document.getElementById('mass-fraction-form')
  const solutionPrepForm = document.getElementById('solution-prep-form')

  // Расчет массы вещества
  massForm.addEventListener('submit', function (e) {
    e.preventDefault()
    calculateMass()
  })

  function calculateMass() {
    try {
      const molarity = parseFloat(
        document.getElementById('mass-molarity').value,
      )
      const volume = parseFloat(document.getElementById('mass-volume').value)
      const molarMass = parseFloat(
        document.getElementById('mass-molar-mass').value,
      )

      if (isNaN(molarity) || isNaN(volume) || isNaN(molarMass)) {
        throw new Error('Пожалуйста, заполните все поля!')
      }

      if (molarity <= 0 || volume <= 0 || molarMass <= 0) {
        throw new Error('Все значения должны быть положительными!')
      }

      const moles = molarity * volume
      const mass = moles * molarMass

      const resultDiv = document.getElementById('mass-result')
      resultDiv.innerHTML = `
                <h4>Результат расчета массы вещества:</h4>
                <div class="calculation-step">
                    <p><strong>Дано:</strong></p>
                    <ul>
                        <li>Молярность (M) = ${molarity} моль/л</li>
                        <li>Объем раствора (V) = ${volume} л</li>
                        <li>Молярная масса (M) = ${molarMass} г/моль</li>
                    </ul>
                </div>
                <div class="calculation-step">
                    <p><strong>Расчет:</strong></p>
                    <p>1. Количество вещества: n = M × V = ${molarity} × ${volume} = ${moles.toFixed(
        4,
      )} моль</p>
                    <p>2. Масса вещества: m = n × M = ${moles.toFixed(
                      4,
                    )} × ${molarMass} = <strong>${mass.toFixed(
        3,
      )} г</strong></p>
                </div>
                <div class="result-highlight">
                    <p><strong>Ответ: ${mass.toFixed(3)} г</strong></p>
                </div>
            `
      resultDiv.classList.add('show')
    } catch (error) {
      showError('mass-result', error.message)
    }
  }

  // Расчет молярности
  molarityForm.addEventListener('submit', function (e) {
    e.preventDefault()
    calculateMolarity()
  })

  function calculateMolarity() {
    try {
      const mass = parseFloat(document.getElementById('molarity-mass').value)
      const molarMass = parseFloat(
        document.getElementById('molarity-molar-mass').value,
      )
      const volume = parseFloat(
        document.getElementById('molarity-volume').value,
      )

      if (isNaN(mass) || isNaN(molarMass) || isNaN(volume)) {
        throw new Error('Пожалуйста, заполните все поля!')
      }

      if (mass <= 0 || molarMass <= 0 || volume <= 0) {
        throw new Error('Все значения должны быть положительными!')
      }

      const moles = mass / molarMass
      const molarity = moles / volume

      const resultDiv = document.getElementById('molarity-result')
      resultDiv.innerHTML = `
                <h4>Результат расчета молярности:</h4>
                <div class="calculation-step">
                    <p><strong>Дано:</strong></p>
                    <ul>
                        <li>Масса вещества (m) = ${mass} г</li>
                        <li>Молярная масса (M) = ${molarMass} г/моль</li>
                        <li>Объем раствора (V) = ${volume} л</li>
                    </ul>
                </div>
                <div class="calculation-step">
                    <p><strong>Расчет:</strong></p>
                    <p>1. Количество вещества: n = m / M = ${mass} / ${molarMass} = ${moles.toFixed(
        4,
      )} моль</p>
                    <p>2. Молярность: C = n / V = ${moles.toFixed(
                      4,
                    )} / ${volume} = <strong>${molarity.toFixed(
        4,
      )} моль/л</strong></p>
                </div>
                <div class="result-highlight">
                    <p><strong>Ответ: ${molarity.toFixed(
                      4,
                    )} М (моль/л)</strong></p>
                </div>
            `
      resultDiv.classList.add('show')
    } catch (error) {
      showError('molarity-result', error.message)
    }
  }

  // Расчет массовой доли
  massFractionForm.addEventListener('submit', function (e) {
    e.preventDefault()
    calculateMassFraction()
  })

  function calculateMassFraction() {
    try {
      const substanceMass = parseFloat(
        document.getElementById('fraction-substance-mass').value,
      )
      const solutionMass = parseFloat(
        document.getElementById('fraction-solution-mass').value,
      )

      if (isNaN(substanceMass) || isNaN(solutionMass)) {
        throw new Error('Пожалуйста, заполните все поля!')
      }

      if (substanceMass <= 0 || solutionMass <= 0) {
        throw new Error('Все значения должны быть положительными!')
      }

      if (substanceMass > solutionMass) {
        throw new Error('Масса вещества не может быть больше массы раствора!')
      }

      const massFraction = (substanceMass / solutionMass) * 100
      const solventMass = solutionMass - substanceMass

      const resultDiv = document.getElementById('mass-fraction-result')
      resultDiv.innerHTML = `
                <h4>Результат расчета массовой доли:</h4>
                <div class="calculation-step">
                    <p><strong>Дано:</strong></p>
                    <ul>
                        <li>Масса растворенного вещества = ${substanceMass} г</li>
                        <li>Масса раствора = ${solutionMass} г</li>
                        <li>Масса растворителя = ${solventMass} г</li>
                    </ul>
                </div>
                <div class="calculation-step">
                    <p><strong>Расчет:</strong></p>
                    <p>ω = (m(вещества) / m(раствора)) × 100%</p>
                    <p>ω = (${substanceMass} / ${solutionMass}) × 100% = <strong>${massFraction.toFixed(
        2,
      )}%</strong></p>
                </div>
                <div class="result-highlight">
                    <p><strong>Ответ: ${massFraction.toFixed(
                      2,
                    )}% (массовая доля)</strong></p>
                </div>
            `
      resultDiv.classList.add('show')
    } catch (error) {
      showError('mass-fraction-result', error.message)
    }
  }

  // Приготовление раствора
  solutionPrepForm.addEventListener('submit', function (e) {
    e.preventDefault()
    calculateSolutionPrep()
  })

  function calculateSolutionPrep() {
    try {
      const molarity = parseFloat(
        document.getElementById('prep-molarity').value,
      )
      const volume = parseFloat(document.getElementById('prep-volume').value)
      const molarMass = parseFloat(
        document.getElementById('prep-molar-mass').value,
      )

      if (isNaN(molarity) || isNaN(volume) || isNaN(molarMass)) {
        throw new Error('Пожалуйста, заполните все поля!')
      }

      if (molarity <= 0 || volume <= 0 || molarMass <= 0) {
        throw new Error('Все значения должны быть положительными!')
      }

      const moles = molarity * volume
      const mass = moles * molarMass

      const resultDiv = document.getElementById('solution-prep-result')
      resultDiv.innerHTML = `
                <h4>Инструкция по приготовлению раствора:</h4>
                <div class="calculation-step">
                    <p><strong>Требуется приготовить:</strong></p>
                    <ul>
                        <li>${volume} л раствора с молярностью ${molarity} М</li>
                    </ul>
                </div>
                <div class="calculation-step">
                    <p><strong>Расчет количества вещества:</strong></p>
                    <p>1. Количество вещества: n = M × V = ${molarity} × ${volume} = ${moles.toFixed(
        4,
      )} моль</p>
                    <p>2. Масса вещества: m = n × M = ${moles.toFixed(
                      4,
                    )} × ${molarMass} = <strong>${mass.toFixed(
        3,
      )} г</strong></p>
                </div>
                <div class="result-highlight">
                    <h5>Необходимо:</h5>
                    <p><strong>${mass.toFixed(3)} г</strong> вещества</p>
                    <p><strong>${volume} л</strong> общего объема раствора</p>
                </div>
                <div class="preparation-steps">
                    <h5>Порядок приготовления:</h5>
                    <ol>
                        <li>Взвесить ${mass.toFixed(3)} г вещества</li>
                        <li>Растворить в небольшом количестве растворителя</li>
                        <li>Довести объем до ${volume} л</li>
                        <li>Тщательно перемешать</li>
                    </ol>
                </div>
            `
      resultDiv.classList.add('show')
    } catch (error) {
      showError('solution-prep-result', error.message)
    }
  }

  function showError(resultId, message) {
    const resultDiv = document.getElementById(resultId)
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
    switch (exampleNumber) {
      case '1':
        // Пример 1: Физраствор (массовая доля)
        document.querySelector('[data-tab="mass-fraction-calc"]').click()
        setTimeout(() => {
          // 0.9% раствор в 500 мл (плотность ≈ 1 г/мл, масса ≈ 500 г)
          document.getElementById('fraction-substance-mass').value = '4.5'
          document.getElementById('fraction-solution-mass').value = '500'
        }, 100)
        break

      case '2':
        // Пример 2: Анализ раствора NaCl (молярность)
        document.querySelector('[data-tab="molarity-calc"]').click()
        setTimeout(() => {
          document.getElementById('molarity-mass').value = '14.625'
          document.getElementById('molarity-molar-mass').value = '58.5'
          document.getElementById('molarity-volume').value = '0.25'
        }, 100)
        break

      case '3':
        // Пример 3: Разбавление HCl (приготовление)
        document.querySelector('[data-tab="solution-prep-calc"]').click()
        setTimeout(() => {
          document.getElementById('prep-molarity').value = '0.1'
          document.getElementById('prep-volume').value = '0.1'
          document.getElementById('prep-molar-mass').value = '36.5'
        }, 100)
        break

      case '4':
        // Пример 4: Электролит (масса вещества)
        document.querySelector('[data-tab="mass-calc"]').click()
        setTimeout(() => {
          document.getElementById('mass-molarity').value = '2.0'
          document.getElementById('mass-volume').value = '1.0'
          document.getElementById('mass-molar-mass').value = '58.5'
        }, 100)
        break

      case '5':
        // Пример 5: Питательный раствор (приготовление)
        document.querySelector('[data-tab="solution-prep-calc"]').click()
        setTimeout(() => {
          document.getElementById('prep-molarity').value = '0.05'
          document.getElementById('prep-volume').value = '10'
          document.getElementById('prep-molar-mass').value = '101'
        }, 100)
        break
    }

    // Прокручиваем к калькулятору
    document.querySelector('.calculator').scrollIntoView({ behavior: 'smooth' })
  }

  // Добавляем автозаполнение для часто используемых веществ
  const commonSubstances = {
    NaCl: 58.5,
    NaOH: 40.0,
    H2SO4: 98.0,
    HCl: 36.5,
    C6H12O6: 180.0,
    CaCl2: 111.0,
    KNO3: 101.0,
    NH4NO3: 80.0,
  }

  // Добавляем подсказки при вводе
  document.addEventListener('input', function (e) {
    if (e.target.type === 'text' && e.target.value in commonSubstances) {
      const molarMassInput = e.target
        .closest('.tab-content')
        .querySelector(
          'input[type="number"][placeholder*="молярная масса" i], input[type="number"][id*="molar-mass"]',
        )
      if (molarMassInput && !molarMassInput.value) {
        molarMassInput.value = commonSubstances[e.target.value]
      }
    }
  })
})
