<script setup>
import bannerImage from '@/assets/img/banner.png'
import '@/assets/css/hero-section.css'
</script>

<template>
  <section id="inicio" class="hero section-wrap">
    <div class="hero-media" aria-hidden="true">
      <img :src="bannerImage" alt="" />
    </div>
    <div class="hero-content">
      <p class="eyebrow">/ about me</p>
      <h1>Hi, I'm Esteban Nava<span class="cursor">_</span></h1>
      <h3 class="subheading">Full-Stack Jr Developer & Computer and Electronic Engineer</h3>
      <p class="hero-copy">
        I build modern, responsive, and scalable web applications using Node.js, React, Angular, and Express.js.
        Passionate about creating innovative digital solutions, improving user experiences, and continuously growing as
        a developer.
      </p>
      <div class="mission">
        <span>// My Mission</span>
        <p>
          Turning ideas into modern digital experiences.
        </p>
        <strong>"Experience is the name everyone gives to their mistakes"<span class="missison">- Oscar
            Wilde</span></strong>
      </div>
    </div>
  </section>
</template>
