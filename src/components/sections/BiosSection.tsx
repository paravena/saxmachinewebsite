import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeader } from '../common/SectionHeader';
import { type MemberBioData } from '../../types/content';

const membersData: MemberBioData[] = [
  {
    id: 'jonathan',
    name: 'Jonathan Gatica',
    roleKey: 'bios.jonathan.role',
    bioKey: 'bios.jonathan.bio',
    image: '/images/jonathan.jpeg',
    tags: [
      { text: 'Conchalí Big Band' },
      { text: 'Cuarteto Perseguidor' },
      { translationKey: 'bios.jonathan.tags.album' },
      { translationKey: 'bios.jonathan.tags.festival' },
    ],
  },
  {
    id: 'felipe',
    name: 'Felipe Vidal',
    roleKey: 'bios.felipe.role',
    bioKey: 'bios.felipe.bio',
    image: '/images/felipe.jpeg',
    tags: [
      { translationKey: 'bios.felipe.tags.experience' },
      { translationKey: 'bios.felipe.tags.cruiseLines' },
      { translationKey: 'bios.felipe.tags.school' },
      { translationKey: 'bios.felipe.tags.bands' },
    ],
  },
];

interface MemberCardProps {
  member: MemberBioData;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const { t } = useLanguage();
  const [photoError, setPhotoError] = useState<boolean>(false);

  return (
    <div className="member reveal">
      <div className="m-photo">
        {!photoError && (
          <img src={member.image} alt={member.name} onError={() => setPhotoError(true)} />
        )}
        <div>
          <div className="ph-icon" aria-hidden="true">
            📷
          </div>
          <span style={{ fontSize: '.76rem' }}>{member.name}</span>
        </div>
      </div>
      <div className="m-body">
        <span className="m-role">{t(member.roleKey)}</span>
        <h3>{member.name}</h3>
        <p>{t(member.bioKey)}</p>
        <div className="m-tags">
          {member.tags.map((tag, idx) => (
            <span key={idx}>{tag.translationKey ? t(tag.translationKey) : tag.text}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BiosSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="bios" id="trayectoria">
      <div className="wrap">
        <SectionHeader
          eyebrow={t('bios.eyebrow')}
          title={t('bios.title')}
          description={t('bios.lead')}
        />
        <div className="members">
          {membersData.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};
