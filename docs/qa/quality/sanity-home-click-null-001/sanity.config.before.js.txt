import {defineConfig, defineField, defineType} from 'sanity';
import {structureTool} from 'sanity/structure';
import {presentationTool, defineLocations} from 'sanity/presentation';

// Public configuration only. No read/deploy token belongs in a Studio variable.
const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN;
const previewUrl = (() => {
  if (!previewOrigin) return null;
  try {
    const url = new URL(previewOrigin);
    return url.origin === previewOrigin && (url.protocol === 'https:' || (url.protocol === 'http:' && url.hostname === 'localhost')) ? previewOrigin : null;
  } catch { return null; }
})();
const groups = [
  {name: 'hero', title: '1 · Welcome / Первый экран', default: true},
  {name: 'services', title: '2 · Services / Услуги'},
  {name: 'mood', title: '3 · Flowers by mood / Настроение'},
  {name: 'custom', title: '4 · Custom & extras / Заказ и дополнения'},
  {name: 'meet', title: '5 · Meet OLA / О студии'},
  {name: 'events', title: '6 · Weddings & events / События'},
  {name: 'labels', title: 'Buttons & accessibility / Кнопки и доступность'},
];

const locales = [
  {name: 'en', title: 'English'},
  {name: 'ru', title: 'Russian'},
  {name: 'sr', title: 'Serbian'},
];
/** @param {string} name @param {string} title @param {boolean} [multiline] */
const localized = (name, title, multiline = false) => defineField({
  name, title, type: 'object', description: 'Edit each language separately: EN — English, RU — Русский, SR — Srpski. Preview selects the matching language; saving a draft does not publish it.', validation: rule => rule.required(),
  fields: locales.map(locale => defineField({
    ...locale, type: multiline ? 'text' : 'string',
    validation: rule => rule.required().custom(value => typeof value === 'string' && value.trim().length > 0 || 'Cannot be blank'),
  })),
});
/** @param {string} name @param {string} title @param {ReturnType<typeof defineField>[]} fields */
const section = (name, title, fields) => defineField({name, title, type: 'object', validation: rule => rule.required(), fields, options: {collapsible: true, collapsed: false}});
/** @param {string} name @param {string} title */
const photo = (name, title) => defineField({name, title, type: 'image', options: {hotspot: true, accept: 'image/jpeg,image/png,image/webp'}, validation: rule => rule.required().assetRequired()});
/** @param {boolean} [handwritten] @param {boolean} [alt] */
const editorial = (handwritten = false, alt = true) => [localized('eyebrow', 'Small heading'), localized('title', 'Heading', true), localized('description', 'Description', true), ...(handwritten ? [localized('handwritten', 'Handwritten caption', true)] : []), ...(alt ? [localized('alt', 'Photo description (accessibility)')] : [])];
/** @param {string} name @param {string} title @param {boolean} [description] */
const card = (name, title, description = true) => section(name, title, [localized('title', 'Title'), ...(description ? [localized('description', 'Description', true)] : []), localized('alt', 'Photo description (accessibility)'), photo('photo', 'Photo')]);
const homePage = defineType({
  name: 'homePage', title: 'Home page / Главная / Početna', type: 'document',
  description: 'Use Home preview to click a heading, button or photo and open its exact field. Complete all three languages and fourteen photos before publishing. Forms remain available in each section tab.',
  groups,
  fields: [
    section('hero', 'Hero', [...editorial(true), photo('photo', 'Hero photo')]),
    section('services', 'Services', [card('flowers', 'Flowers'), card('balloons', 'Balloons and gifts'), card('weddings', 'Weddings and events'), photo('weddingsMobile', 'Weddings photo on mobile')]),
    section('mood', 'Mood introduction', editorial(false, false)),
    section('moods', 'Mood cards', [card('romantic', 'Romantic', false), card('bright', 'Bright', false), card('natural', 'Natural', false)]),
    section('custom', 'Custom flowers', [...editorial(), photo('photo', 'Photo')]),
    section('extras', 'Extras', [localized('title', 'Heading'), localized('description', 'Description', true), ...['balloons', 'card', 'chocolates'].map(name => section(name, name[0].toUpperCase() + name.slice(1), [localized('title', 'Label'), localized('alt', 'Photo description (accessibility)'), photo('photo', 'Photo')]))]),
    section('meet', 'Meet OLA', [...editorial(true), photo('photo', 'Photo')]),
    section('events', 'Events', [...editorial(), photo('photo', 'Photo')]),
    section('labels', 'Home page buttons and labels', [
      localized('shopBouquets', 'Shop bouquets button'),
      localized('letOlaChoose', 'Let OLA choose button'),
      localized('servicesLabel', 'Services section accessibility label'),
      localized('viewAllBouquets', 'View all bouquets link'),
      localized('viewBouquet', 'View bouquet link'),
      localized('moodRailLabel', 'Mood cards accessibility label'),
      localized('letOlaCreate', 'Let OLA create button'),
      localized('aboutOla', 'About OLA button'),
      localized('exploreEvents', 'Explore events button'),
    ]),
  ].map(field => ({...field, group: field.name === 'moods' ? 'mood' : field.name === 'extras' ? 'custom' : field.name})),
  preview: {prepare: () => ({title: 'OLA · Home / Главная / Početna', subtitle: 'EN · RU · SR — six sections, fourteen photos'})},
});
export default defineConfig({
  name: 'default', title: 'OLA Home', projectId: 'zhn2ddaj', dataset: 'production',
  plugins: [
    ...(previewUrl ? [presentationTool({
      title: 'Home preview / Редактировать на странице',
      previewUrl: {initial: `${previewUrl}/en`, previewMode: {enable: '/api/draft-mode/enable'}},
      resolve: {
        mainDocuments: ['en', 'ru', 'sr'].map(locale => ({route: `/${locale}`, filter: '_type == "homePage" && _id == "homePage"'})),
        locations: {homePage: defineLocations({locations: [{title: 'English · Home', href: '/en'}, {title: 'Русский · Главная', href: '/ru'}, {title: 'Srpski · Početna', href: '/sr'}]})},
      },
    })] : []),
    structureTool({title: previewUrl ? 'Section forms / Поля' : 'Home forms — preview URL not configured', structure: S => S.list().title('Home · EN / RU / SR').items([S.listItem().title('Home page · six sections + buttons').child(S.document().schemaType('homePage').documentId('homePage'))])}),
  ], schema: {types: [homePage]},
  document: {singletons: ['homePage']},
});
