# GitHub Pages Blog

A clean and simple blog built with Jekyll and GitHub Pages.

## Structure

```
.
├── _config.yml          # Jekyll configuration
├── _posts/              # Blog posts go here
├── _layouts/            # HTML templates
│   ├── default.html     # Default layout
│   └── post.html        # Blog post layout
├── _includes/           # Reusable components
├── assets/              # Static assets
│   ├── css/             # Stylesheets
│   └── images/          # Images
├── index.md             # Home page
├── about.md             # About page
├── Gemfile              # Ruby dependencies
└── README.md            # This file
```

## Local Development

### Prerequisites

- Ruby (version 2.7 or higher)
- Bundler (`gem install bundler`)

### Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   bundle install
   ```

3. Run the local server:
   ```bash
   bundle exec jekyll serve
   ```

4. Open your browser to `http://localhost:4000`

## Creating Blog Posts

1. Create a new file in `_posts/` directory
2. Name it using the format: `YYYY-MM-DD-title-of-post.md`
3. Add front matter at the top:
   ```yaml
   ---
   layout: post
   title: "Your Post Title"
   date: YYYY-MM-DD HH:MM:SS -0000
   categories: [category1, category2]
   ---
   ```
4. Write your content in Markdown below the front matter
5. Commit and push to publish

## Configuration

Edit `_config.yml` to customize:
- Site title and description
- Email and social links
- Theme settings
- Build options

## Deployment

This site is automatically deployed to GitHub Pages when you push to the main branch.

Your site will be available at: `https://yourusername.github.io`

## Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Markdown Guide](https://www.markdownguide.org/)

## License

This project is open source and available under the MIT License.
