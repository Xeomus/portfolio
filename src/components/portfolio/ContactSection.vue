<script setup>
import '@/assets/css/contact-section.css'
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

    <form class="contact-form">
      <label>
        Name*
        <input type="text" name="name" autocomplete="name" placeholder="Your Name" />
      </label>
      <label>
        Email*
        <input type="email" name="email" autocomplete="email" placeholder="john@doe.com" />
      </label>
      <label class="full">
        Message*
        <textarea name="message" maxlength="500" placeholder="Hello there, I would like to ask you about..."></textarea>
      </label>
      <button type="submit">
        <i class="bi bi-send-fill btn-icon" aria-hidden="true"></i>
        Send
      </button>
    </form>
  </section>
</template>
