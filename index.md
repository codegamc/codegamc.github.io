---
layout: default
title: Home
---

# Welcome

This is a fresh GitHub Pages blog, ready for your content.

## Recent Posts

{% if site.posts.size > 0 %}
<ul class="post-list">
  {% for post in site.posts %}
  <li class="post-item">
    <h2>
      <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
    <p class="post-meta">{{ post.date | date: "%B %-d, %Y" }}</p>
    <p class="post-excerpt">{{ post.excerpt }}</p>
  </li>
  {% endfor %}
</ul>
{% else %}
<p>No posts yet. Stay tuned!</p>
{% endif %}
