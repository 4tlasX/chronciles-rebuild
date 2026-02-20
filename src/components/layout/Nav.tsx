import Link from 'next/link';
import { LogoutButton } from '@/components/auth';

export interface NavLink {
  href: string;
  label: string;
}

export interface NavProps {
  brand?: string;
  brandHref?: string;
  links?: NavLink[];
}

const defaultLinks: NavLink[] = [
  { href: '/', label: 'Posts' },
  { href: '/topics', label: 'Topics' },
  { href: '/settings', label: 'Settings' },
];

export function Nav({
  brand = 'Chronicles',
  brandHref = '/',
  links = defaultLinks,
}: NavProps) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href={brandHref} className="nav-brand" prefetch={false}>
          {brand}
        </Link>
        <div className="nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href} prefetch={false}>
              {link.label}
            </Link>
          ))}
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
