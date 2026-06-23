import os, glob
css = """<style>
:root{--ifm-color-primary:#D4FF3F!important;--ifm-background-color:#0d0d0d!important;--ifm-navbar-background-color:#0d0d0d!important;--ifm-footer-background-color:#0d0d0d!important;--ifm-code-background:#1a1a1a!important;--ifm-card-background-color:#141414!important;--ifm-heading-color:#fff!important;--ifm-font-color-base:#ccc!important;--ifm-link-color:#D4FF3F!important;--ifm-menu-color-active:#D4FF3F!important;--doc-sidebar-width:240px!important;--ifm-container-width-xl:1100px!important}
.footer{background:#0d0d0d!important;border-top:1px solid #1a1a1a!important}.footer__copyright{color:#555!important}
.navbar{border-bottom:1px solid #1a1a1a!important;box-shadow:none!important;background:#0d0d0d!important}
.navbar__title{color:#D4FF3F!important}.navbar__link{color:#999!important}.navbar__link:hover,.navbar__link--active{color:#D4FF3F!important}
.markdown h1,.markdown h2,.markdown h3{color:#fff!important}.markdown p{color:#bbb!important;line-height:1.7!important}
table th{background:#141414!important;color:#D4FF3F!important;border-color:#222!important}table td{border-color:#222!important}
.menu__link--active:not(.menu__link--sublist){background:rgba(212,255,63,.08)!important;color:#D4FF3F!important;border-left:2px solid #D4FF3F!important}
.table-of-contents__link{color:#666!important}.table-of-contents__link--active{color:#D4FF3F!important}
.prism-code,pre{background:#1a1a1a!important;border:1px solid #222!important}
</style>"""
for f in glob.glob('/var/www/Griz/artifacts/docs-site/build/**/*.html', recursive=True):
    c=open(f).read()
    if '<!-- GRIZZLY INLINE -->' in c:
        s=c.find('<!-- GRIZZLY INLINE -->');e=c.find('</style>',s)+8;c=c[:s]+c[e:]
    open(f,'w').write(c.replace('</head>','<!-- GRIZZLY INLINE -->\n'+css+'</head>'))
print('Theme applied')
