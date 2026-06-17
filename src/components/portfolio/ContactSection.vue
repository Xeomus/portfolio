<script setup>
import '@/assets/css/contact-section.css'
import { computed, reactive } from 'vue'

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const state = reactive({
  error: '',
  succeeded: false,
  submitting: false,
})

const submitLabel = computed(() => (state.submitting ? 'Sending...' : 'Send'))

async function handleSubmit() {
  state.error = ''
  state.succeeded = false
  state.submitting = true

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        _subject: form.subject,
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      const formspreeError = data?.errors?.[0]?.message

      throw new Error(formspreeError || 'The message could not be sent. Please try again.')
    }

    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    state.succeeded = true
  } catch (error) {
    state.error = error.message || 'The message could not be sent. Please try again.'
  } finally {
    state.submitting = false
  }
}
</script>

<template>
  <section id="contacto" class="section-wrap contact" aria-labelledby="contact-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">Contact me.</p>
        <h2 id="contact-title">Get In Touch</h2>
      </div>
      <p>
        I'm available to create web applications, automations, and digital experiences with
        a professional approach.
      </p>
    </div>

    <form class="contact-form" @submit.prevent="handleSubmit">
      <label>
        Name*
        <input
          v-model.trim="form.name"
          type="text"
          name="name"
          autocomplete="name"
          placeholder="Your Name"
          required
        />
      </label>
      <label>
        Email*
        <input
          v-model.trim="form.email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="john@doe.com"
          required
        />
      </label>
      <label class="full">
        Subject*
        <input
          v-model.trim="form.subject"
          type="text"
          name="subject"
          autocomplete="off"
          placeholder="Project inquiry, collaboration, or question"
          required
        />
      </label>
      <label class="full">
        Message*
        <textarea
          v-model.trim="form.message"
          name="message"
          placeholder="Hello there, I would like to ask you about..."
          required
        ></textarea>
      </label>
      <p v-if="state.succeeded" class="contact-form__status contact-form__status--success">
        Thanks. Your message has been sent.
      </p>
      <p v-if="state.error" class="contact-form__status contact-form__status--error">
        {{ state.error }}
      </p>
      <button type="submit" :disabled="state.submitting">
        <i class="bi bi-send-fill btn-icon" aria-hidden="true"></i>
        {{ submitLabel }}
      </button>
    </form>
  </section>
</template>
