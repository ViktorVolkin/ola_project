import {EnquiryLink} from '@/components/widgets/EnquiryLink/EnquiryLink';
import {actionClassName} from '@/components/shared/ActionLink';
import {Icon} from '@/components/shared/Icon';
export default async function Page({params}: PageProps<'/[locale]'>) {
  const {locale} = await params;
  const label = locale === 'ru' ? 'Спросить студию' : locale === 'sr' ? 'Pitajte studio' : 'Ask the studio';
  return <><h1>Action button browser smoke</h1><div className="siblings"><div data-compare="legacy"><button type="button" className={actionClassName('primary')} disabled title="Unavailable" aria-describedby="enquiry-unavailable"><span>{label}</span><Icon name="arrow-right" /></button></div><div data-compare="adopted"><EnquiryLink variant="primary" subject="fixture">{label}</EnquiryLink></div></div></>;
}
