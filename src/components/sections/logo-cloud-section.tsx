
'use client';

import LogoLoop from '../LogoLoop';

const imageLogos = [
    {
      src: 'https://ik.imagekit.io/fyttdlzz0/Logos/TensorFlow.png?updatedAt=1758583509913',
      alt: 'TensorFlow',
      href: 'https://www.tensorflow.org'
    },
    {
      src: 'https://ik.imagekit.io/fyttdlzz0/Logos/Streamlit.svg?updatedAt=1758583509927',
      alt: 'Streamlit',
      href: 'https://streamlit.io'
    },
    {
      src: 'https://ik.imagekit.io/fyttdlzz0/Logos/postgresql-logo-svgrepo-com.svg?updatedAt=1758583503958',
      alt: 'PostgreSQL',
      href: 'https://www.postgresql.org'
    },
    {
      src: 'https://ik.imagekit.io/fyttdlzz0/Logos/logomark.svg?updatedAt=1758583503923',
      alt: 'Firebase',
      href: 'https://firebase.google.com'
    },
    {
      src: 'https://ik.imagekit.io/fyttdlzz0/Logos/crewai-color.svg?updatedAt=1758583503925',
      alt: 'CREW AI',
      href: 'https://crewai.io'
    },
    {
      src: 'https://ik.imagekit.io/fyttdlzz0/Logos/PyTorch.png?updatedAt=1758583503754',
      alt: 'PyTorch',
      href: 'https://pytorch.org'
    },
    {
      src: 'https://ik.imagekit.io/fyttdlzz0/Logos/Logomark_Full%20Color.png?updatedAt=1758583503761',
      alt: 'Firebase',
      href: 'https://firebase.google.com'
    },
    {
      src: 'https://ik.imagekit.io/fyttdlzz0/Logos/aistudio-color.svg?updatedAt=1758583503815',
      alt: 'AI Studio',
      href: 'https://aistudio.google.com'
    },
    {
      src: 'https://ik.imagekit.io/fyttdlzz0/Logos/ollama-color.svg?updatedAt=1758583503660',
      alt: 'Ollama',
      href: 'https://ollama.ai'
    },
    {
      src: 'https://ik.imagekit.io/fyttdlzz0/Logos/SQLite.svg?updatedAt=1758583503580',
      alt: 'SQLite',
      href: 'https://sqlite.org'
    },
    {
      src: 'https://ik.imagekit.io/fyttdlzz0/Logos/Chroma--Streamline-Svg-Logos.svg?updatedAt=1758583503659',
      alt: 'Chroma',
      href: 'https://www.trychroma.com/'
    },
  ];

export function LogoCloudSection() {
    return (
        <section className="py-16 sm:py-24">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                        Powered By Cutting-Edge Technologies
                    </h2>
                </div>
                 <LogoLoop
                    logos={imageLogos}
                    speed={100}
                    direction="left"
                    logoHeight={40}
                    gap={40}
                    pauseOnHover
                    scaleOnHover
                    fadeOut
                    ariaLabel="Technology and partner logos"
                />
            </div>
        </section>
    )
}
