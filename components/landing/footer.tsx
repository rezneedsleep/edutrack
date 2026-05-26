import Link from 'next/link'
import { GraduationCap, Twitter, Instagram, Linkedin, Youtube, Github } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Fitur', href: '#features' },
    { label: 'Cara Kerja', href: '#how-it-works' },
    { label: 'Harga', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
  company: [
    { label: 'Tentang Kami', href: '#' },
    { label: 'Karir', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Kontak', href: '#' },
  ],
  legal: [
    { label: 'Kebijakan Privasi', href: '#' },
    { label: 'Syarat & Ketentuan', href: '#' },
    { label: 'Keamanan', href: '#' },
  ],
}

const socialLinks = [
  { label: 'Twitter', href: 'https://x.com/workwithsuzirz', icon: Twitter },
  { label: 'Instagram', href: 'https://instagram.com/davinmaritza', icon: Instagram },
  { label: 'GitHub', href: 'https://github.com/davinmaritza', icon: Github },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
  { label: 'YouTube', href: '#', icon: Youtube },
]

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                EduTrack
              </span>
            </Link>
            <p className="text-body-sm text-muted-foreground max-w-xs">
              Platform monitoring kemajuan belajar siswa SMA/SMK yang simpel,
              real-time, dan gratis.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-body-sm font-semibold text-foreground mb-4">
              Produk
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-body-sm font-semibold text-foreground mb-4">
              Perusahaan
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-body-sm font-semibold text-foreground mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-caption text-muted-foreground">
            © {new Date().getFullYear()} EduTrack. Hak cipta dilindungi.
          </p>
          <p className="text-caption text-muted-foreground">
            Dibuat dengan cinta di Indonesia
          </p>
        </div>
      </div>
    </footer>
  )
}
