import type { Metadata, Viewport } from 'next';
import { Inter, Poppins, Archivo_Black, Overpass } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

const overpass = Overpass({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-overpass',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-display',
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://growmusicians.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'RepostChain — Grow Your SoundCloud Music Reach, Build Fans & Share Feedback',
    template: '%s | RepostChain',
  },
  description:
    'Join 5,000+ SoundCloud artists on RepostChain. Grow your audience organically through artist-to-artist repost campaigns, real listener feedback, and detailed SoundCloud analytics. 100% free to get started.',
  keywords: [
    'RepostChain',
    'Grow Musicians',
    'growmusicians.com',
    'SoundCloud promotion',
    'SoundCloud repost exchange',
    'organic SoundCloud growth',
    'music promotion platform',
    'SoundCloud reposts',
    'independent artist promotion',
    'music marketing',
    'SoundCloud followers',
    'artist collaboration network',
  ],
  authors: [{ name: 'Tunexa Limited', url: SITE_URL }],
  creator: 'Tunexa Limited',
  publisher: 'Tunexa Limited',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'RepostChain',
    title: 'RepostChain — Grow Your SoundCloud Music Reach Organically',
    description:
      'Join 5,000+ music creators growing their fanbase through authentic SoundCloud repost exchanges, real artist feedback, and smart genre matching.',
    images: [
      {
        url: '/frontend/user/image/FeaturedArtist.png',
        width: 1200,
        height: 630,
        alt: 'RepostChain — Collaborative SoundCloud Music Promotion Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RepostChain — Grow Your SoundCloud Music Reach',
    description:
      'Connect with 5,000+ SoundCloud artists, exchange organic reposts, and grow your real fanbase for free.',
    images: ['/frontend/user/image/FeaturedArtist.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'GVWhyXjde2aylNlCiqPIqSvPhx-VGi6hh5ajLaa-erg',
  },
  icons: {
    icon: '/assets/favicons/fav icon 1.svg',
    shortcut: '/default_img/logo.svg',
    apple: '/assets/logo/logo-1.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${overpass.variable} ${inter.variable} ${poppins.variable} ${archivoBlack.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'system') {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.classList.toggle('dark', prefersDark);
                    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                  } else {
                    document.documentElement.classList.toggle('dark', theme === 'dark');
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-slate-800 dark:text-white min-h-screen overflow-x-hidden antialiased transition-colors duration-200 relative`}
        suppressHydrationWarning
      >
        <QueryProvider>{children}</QueryProvider>
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1001160992310803');
            fbq('track', 'PageView');
          `}
        </Script>
      </body>
    </html>
  );
}
