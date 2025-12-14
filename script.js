// Химия калькуляторларының негізгі беті - Қазақша

// Бетті жүктеу анимациясы
document.addEventListener('DOMContentLoaded', function () {
  // Жүктелу хабарламасы
  showMessage('Химия калькуляторларына қош келдіңіз!')

  // Бөлшектер эффектісін қосу
  createParticles()

  // Картаға hover эффектісін қосу
  addCardHoverEffects()
})

// Хабарламаларды көрсету функциясы
function showMessage(message, isError = false) {
  const messageDiv = document.createElement('div')
  messageDiv.textContent = message
  messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        font-weight: 500;
        background: ${
          isError
            ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
            : 'linear-gradient(135deg, #00d2d3, #54a0ff)'
        };
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `

  document.body.appendChild(messageDiv)

  setTimeout(() => {
    messageDiv.style.transform = 'translateX(0)'
  }, 100)

  setTimeout(() => {
    messageDiv.style.transform = 'translateX(400px)'
    setTimeout(() => {
      document.body.removeChild(messageDiv)
    }, 300)
  }, 3000)
}

// Бөлшектер анимациясын жасау
function createParticles() {
  const particleContainer = document.createElement('div')
  particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `
  document.body.appendChild(particleContainer)

  for (let i = 0; i < 50; i++) {
    createParticle(particleContainer)
  }
}

function createParticle(container) {
  const particle = document.createElement('div')
  particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        animation: float ${Math.random() * 3 + 2}s infinite linear;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
    `

  container.appendChild(particle)

  // Анимация аяқталғаннан кейін бөлшекті жою
  setTimeout(() => {
    if (container.contains(particle)) {
      container.removeChild(particle)
    }
  }, 5000)
}

// CSS анимациясын қосу
const style = document.createElement('style')
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) translateX(0px);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(100px);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Карталарға hover эффектісін қосу
function addCardHoverEffects() {
  const cards = document.querySelectorAll('.calculator-card')

  cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) scale(1.02)'
      this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)'
    })

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)'
      this.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    })

    card.addEventListener('click', function () {
      const link = this.querySelector('a')
      if (link) {
        showMessage(`${link.textContent} бетіне өтуде...`)
        setTimeout(() => {
          window.location.href = link.href
        }, 500)
      }
    })
  })
}

// Қосымша интерактивтілік
document.addEventListener('click', function (e) {
  // Клик эффектісі
  createClickEffect(e.clientX, e.clientY)
})

function createClickEffect(x, y) {
  const ripple = document.createElement('div')
  ripple.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1000;
    `

  document.body.appendChild(ripple)

  setTimeout(() => {
    document.body.removeChild(ripple)
  }, 600)
}

// Ripple анимациясын қосу
const rippleStyle = document.createElement('style')
rippleStyle.textContent = `
    @keyframes ripple {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
`
document.head.appendChild(rippleStyle)

// Пернетақта навигациясы
document.addEventListener('keydown', function (e) {
  switch (e.key) {
    case '1':
      window.location.href = 'page1.html'
      break
    case '2':
      window.location.href = 'page2.html'
      break
    case 'Escape':
      showMessage('Басты бетте орналасып тұрсыз')
      break
  }
})

// Мобильді құрылғылар үшін touch эффектісі
document.addEventListener('touchstart', function (e) {
  if (e.touches.length === 1) {
    const touch = e.touches[0]
    createClickEffect(touch.clientX, touch.clientY)
  }
})

// Скролл эффектісі
window.addEventListener('scroll', function () {
  const scrolled = window.pageYOffset
  const parallax = scrolled * 0.5

  document.body.style.backgroundPositionY = parallax + 'px'
})

// Қосымша визуалды эффекттер
setInterval(createFloatingParticle, 3000)

function createFloatingParticle() {
  const particle = document.createElement('div')
  particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: rgba(118, 199, 192, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        animation: floatUp ${Math.random() * 4 + 3}s linear;
        pointer-events: none;
        z-index: -1;
    `

  document.body.appendChild(particle)

  setTimeout(() => {
    if (document.body.contains(particle)) {
      document.body.removeChild(particle)
    }
  }, 7000)
}

// Float up анимациясы
const floatUpStyle = document.createElement('style')
floatUpStyle.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`
document.head.appendChild(floatUpStyle)
