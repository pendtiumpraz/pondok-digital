# 🌐 Dual Public Pages System dengan CMS Builder

## 📊 Architecture Overview

```
sistempondok.id (Main Landing)
├── Features
├── Pricing  
├── Demo
└── Sign Up

pondok-syafii.sistempondok.id (Tenant Public)
├── Home (Customizable)
├── Profile
├── Programs
├── PPDB (Pendaftaran)
├── Gallery
└── Contact
```

## 🎨 1. Main Platform Landing Page

### **sistempondok.id** (Platform Marketing)
```typescript
// app/page.tsx - Main landing
export default function PlatformLanding() {
  return (
    <>
      <Hero>
        <h1>Platform Manajemen Pondok Pesantren #1 di Indonesia</h1>
        <p>Kelola ribuan santri dengan mudah. Trusted by 500+ Pondok</p>
        <Button href="/demo">Coba Demo</Button>
        <Button href="/pricing">Lihat Harga</Button>
      </Hero>
      
      <Features>
        - Manajemen Santri & Ustadz
        - Sistem Keuangan Terintegrasi  
        - Akademik & Kurikulum
        - Portal Orang Tua
        - Laporan Real-time
      </Features>
      
      <Testimonials>
        {/* Success stories dari pondok yang pakai */}
      </Testimonials>
      
      <Pricing>
        - Starter: 100 santri
        - Growth: 500 santri
        - Scale: 1000+ santri
      </Pricing>
    </>
  )
}
```

## 🏫 2. Tenant Public Pages (Per Yayasan)

### **[tenant].sistempondok.id** (Customizable)
```typescript
// app/[tenant]/page.tsx
export default async function TenantPublicPage({ 
  params 
}: { 
  params: { tenant: string } 
}) {
  const tenant = await getTenantBySlug(params.tenant)
  const template = tenant.selectedTemplate // 'modern', 'classic', 'islamic'
  const content = tenant.publicContent // CMS data
  
  return (
    <TemplateRenderer 
      template={template}
      content={content}
      branding={tenant.branding}
    />
  )
}
```

## 🛠️ CMS Builder System

### Database Schema for CMS
```prisma
model Tenant {
  // ... existing fields
  
  // Public Page Settings
  selectedTemplate  String      @default("modern")
  customDomain      String?     // pondoksyafii.sch.id
  publicContent     Json        // CMS content
  branding          Json        // Colors, fonts, logo
  seoSettings       Json        // Meta tags, OG image
  
  // CMS Components
  pages             Page[]
  menus             Menu[]
  sliders           Slider[]
  galleries         Gallery[]
  announcements     Announcement[]
  facilities        Facility[]
  programs          Program[]
}

model Page {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  
  slug        String   // /about, /visi-misi
  title       String
  content     Json     // Block-based content
  template    String   // page template
  isPublished Boolean  @default(false)
  
  seo         Json     // SEO settings
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([tenantId, slug])
}

model Template {
  id          String   @id @default(cuid())
  name        String   // "Modern Islamic"
  slug        String   @unique // "modern-islamic"
  preview     String   // Preview image URL
  category    String   // islamic, modern, classic
  
  // Template Configuration
  layouts     Json     // Available layouts
  components  Json     // Available components
  styles      Json     // CSS variables
  features    Json     // Enabled features
  
  isPremium   Boolean  @default(false)
  price       Int?     // If premium
  
  tenants     Tenant[]
}
```

## 🎨 Template Gallery

### Available Templates
```typescript
const templates = [
  {
    id: 'modern-green',
    name: 'Modern Hijau',
    category: 'modern',
    preview: '/templates/modern-green.jpg',
    features: ['slider', 'gallery', 'blog', 'events'],
    isPremium: false
  },
  {
    id: 'islamic-classic',
    name: 'Islamic Classic',
    category: 'islamic',
    preview: '/templates/islamic-classic.jpg',
    features: ['quran-verse', 'prayer-times', 'islamic-calendar'],
    isPremium: false
  },
  {
    id: 'minimalist',
    name: 'Minimalist Pro',
    category: 'modern',
    preview: '/templates/minimalist.jpg',
    features: ['animations', 'parallax', 'video-bg'],
    isPremium: true,
    price: 500000 // Rp 500k one-time
  },
  {
    id: 'boarding-school',
    name: 'Boarding School',
    category: 'education',
    preview: '/templates/boarding.jpg',
    features: ['virtual-tour', 'facilities-3d', 'admission'],
    isPremium: true,
    price: 1000000
  }
]
```

## 🖥️ CMS Dashboard Interface

### Admin Dashboard - Public Pages Manager
```typescript
// app/(authenticated)/admin/public-pages/page.tsx
export default function PublicPagesManager() {
  return (
    <Tabs defaultValue="content">
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="design">Design</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content">
        <CMSContentEditor />
      </TabsContent>
      
      <TabsContent value="design">
        <TemplateSelector />
        <BrandingCustomizer />
      </TabsContent>
      
      <TabsContent value="seo">
        <SEOSettings />
      </TabsContent>
      
      <TabsContent value="settings">
        <DomainSettings />
        <PublishSettings />
      </TabsContent>
    </Tabs>
  )
}
```

### Visual Page Builder
```typescript
// components/cms/PageBuilder.tsx
import { DndProvider } from 'react-dnd'

export function PageBuilder() {
  const [blocks, setBlocks] = useState([])
  
  const availableBlocks = [
    { type: 'hero', name: 'Hero Section', icon: Layout },
    { type: 'about', name: 'Tentang Kami', icon: Info },
    { type: 'stats', name: 'Statistik', icon: BarChart },
    { type: 'programs', name: 'Program', icon: Book },
    { type: 'teachers', name: 'Ustadz', icon: Users },
    { type: 'facilities', name: 'Fasilitas', icon: Building },
    { type: 'gallery', name: 'Galeri', icon: Image },
    { type: 'testimonial', name: 'Testimoni', icon: MessageSquare },
    { type: 'cta', name: 'Call to Action', icon: Phone },
    { type: 'contact', name: 'Kontak', icon: Mail },
    { type: 'map', name: 'Lokasi', icon: MapPin },
    { type: 'custom', name: 'Custom HTML', icon: Code }
  ]
  
  return (
    <DndProvider>
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar - Available Blocks */}
        <div className="col-span-1 border-r pr-4">
          <h3 className="font-bold mb-4">Components</h3>
          <div className="space-y-2">
            {availableBlocks.map(block => (
              <DraggableBlock key={block.type} {...block} />
            ))}
          </div>
        </div>
        
        {/* Canvas - Page Preview */}
        <div className="col-span-2">
          <div className="border rounded-lg p-4 min-h-screen">
            <h3 className="font-bold mb-4">Page Canvas</h3>
            <DroppableCanvas blocks={blocks} onChange={setBlocks} />
          </div>
        </div>
        
        {/* Properties Panel */}
        <div className="col-span-1 border-l pl-4">
          <h3 className="font-bold mb-4">Properties</h3>
          <BlockProperties selectedBlock={selectedBlock} />
        </div>
      </div>
    </DndProvider>
  )
}
```

## 🎨 Template Customization

### Brand Customizer
```typescript
// components/cms/BrandCustomizer.tsx
export function BrandCustomizer() {
  const [branding, setBranding] = useState({
    primaryColor: '#10b981',
    secondaryColor: '#3b82f6',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    fontSizeBase: '16px',
    borderRadius: '8px',
    logo: null,
    favicon: null
  })
  
  return (
    <div className="space-y-6">
      {/* Color Picker */}
      <div>
        <Label>Primary Color</Label>
        <ColorPicker 
          value={branding.primaryColor}
          onChange={(color) => setBranding({...branding, primaryColor: color})}
        />
      </div>
      
      {/* Font Selection */}
      <div>
        <Label>Font Family</Label>
        <Select value={branding.fontFamily}>
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Poppins">Poppins</option>
          <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
          <option value="Amiri">Amiri (Arabic)</option>
        </Select>
      </div>
      
      {/* Logo Upload */}
      <div>
        <Label>Logo</Label>
        <ImageUpload 
          value={branding.logo}
          onChange={(file) => setBranding({...branding, logo: file})}
        />
      </div>
      
      {/* Live Preview */}
      <div>
        <h4>Live Preview</h4>
        <TemplatePreview branding={branding} />
      </div>
    </div>
  )
}
```

## 📝 Content Management

### Dynamic Content Blocks
```typescript
// Block Types
interface ContentBlock {
  id: string
  type: BlockType
  content: any
  settings: BlockSettings
}

// Hero Block
const HeroBlock = {
  type: 'hero',
  content: {
    title: 'Pondok Pesantren Imam Syafi\'i',
    subtitle: 'Mencetak Generasi Qurani Berakhlak Mulia',
    backgroundImage: '/hero-bg.jpg',
    ctaButtons: [
      { text: 'Daftar Sekarang', link: '/ppdb' },
      { text: 'Virtual Tour', link: '/tour' }
    ]
  },
  settings: {
    height: 'full', // full, large, medium
    overlay: true,
    parallax: true
  }
}

// Stats Block
const StatsBlock = {
  type: 'stats',
  content: {
    title: 'Pondok Kami dalam Angka',
    stats: [
      { number: '2500+', label: 'Santri Aktif' },
      { number: '150+', label: 'Ustadz Berpengalaman' },
      { number: '25', label: 'Tahun Berdiri' },
      { number: '95%', label: 'Tingkat Kelulusan' }
    ]
  },
  settings: {
    animation: 'countUp',
    layout: 'grid' // grid, carousel
  }
}
```

## 🌍 Multi-Domain Support

### Custom Domain Configuration
```typescript
// app/api/domains/route.ts
export async function POST(req: Request) {
  const { domain, tenantId } = await req.json()
  
  // Add to Vercel
  await fetch(`https://api.vercel.com/v10/domains`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
    },
    body: JSON.stringify({
      name: domain,
      projectId: process.env.VERCEL_PROJECT_ID
    })
  })
  
  // Update tenant
  await prisma.tenant.update({
    where: { id: tenantId },
    data: { customDomain: domain }
  })
  
  return NextResponse.json({ 
    success: true,
    instructions: `Add CNAME record pointing to cname.vercel-dns.com`
  })
}
```

## 📱 Responsive Preview

### Device Preview Component
```typescript
export function DevicePreview({ url }: { url: string }) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  
  const sizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  }
  
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button 
          variant={device === 'desktop' ? 'default' : 'outline'}
          onClick={() => setDevice('desktop')}
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button 
          variant={device === 'tablet' ? 'default' : 'outline'}
          onClick={() => setDevice('tablet')}
        >
          <Tablet className="w-4 h-4" />
        </Button>
        <Button 
          variant={device === 'mobile' ? 'default' : 'outline'}
          onClick={() => setDevice('mobile')}
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>
      
      <div 
        className="border rounded-lg overflow-hidden mx-auto"
        style={sizes[device]}
      >
        <iframe 
          src={url}
          className="w-full h-full"
          style={{ transform: device === 'mobile' ? 'scale(0.7)' : 'scale(1)' }}
        />
      </div>
    </div>
  )
}
```

## 🔍 SEO Management

### SEO Settings Panel
```typescript
export function SEOSettings() {
  const [seo, setSeo] = useState({
    title: 'Pondok Pesantren Imam Syafi\'i',
    description: 'Pondok pesantren modern dengan kurikulum...',
    keywords: ['pondok', 'pesantren', 'islamic', 'boarding school'],
    ogImage: '/og-image.jpg',
    robots: 'index, follow',
    canonical: 'https://pondok-syafii.sistempondok.id'
  })
  
  return (
    <div className="space-y-4">
      <div>
        <Label>Page Title</Label>
        <Input 
          value={seo.title}
          onChange={(e) => setSeo({...seo, title: e.target.value})}
        />
        <p className="text-sm text-gray-500">
          {seo.title.length}/60 characters
        </p>
      </div>
      
      <div>
        <Label>Meta Description</Label>
        <Textarea 
          value={seo.description}
          onChange={(e) => setSeo({...seo, description: e.target.value})}
        />
        <p className="text-sm text-gray-500">
          {seo.description.length}/160 characters
        </p>
      </div>
      
      {/* SEO Preview */}
      <div className="border rounded p-4">
        <h4 className="text-blue-600">{seo.title}</h4>
        <p className="text-green-600 text-sm">{seo.canonical}</p>
        <p className="text-gray-600 text-sm">{seo.description}</p>
      </div>
    </div>
  )
}
```

## 📊 Analytics Integration

### Public Page Analytics
```typescript
// components/analytics/PublicPageAnalytics.tsx
export function PublicPageAnalytics({ tenantId }: { tenantId: string }) {
  const stats = useAnalytics(tenantId)
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard 
        title="Page Views"
        value={stats.pageViews}
        change="+12%"
        icon={Eye}
      />
      <StatCard 
        title="Unique Visitors"
        value={stats.uniqueVisitors}
        change="+8%"
        icon={Users}
      />
      <StatCard 
        title="Avg. Duration"
        value={stats.avgDuration}
        change="+15%"
        icon={Clock}
      />
      <StatCard 
        title="PPDB Clicks"
        value={stats.ppdbClicks}
        change="+25%"
        icon={MousePointer}
      />
    </div>
  )
}
```

## 🚀 Publishing Workflow

### Publish Settings
```typescript
export function PublishSettings() {
  const [settings, setSettings] = useState({
    status: 'draft', // draft, published
    publishedAt: null,
    scheduledFor: null,
    password: '', // Password protection
    allowIndexing: true,
    maintenanceMode: false
  })
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Status</Label>
        <Badge variant={settings.status === 'published' ? 'success' : 'warning'}>
          {settings.status}
        </Badge>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={() => saveAsDraft()}
        >
          Save as Draft
        </Button>
        <Button 
          variant="default"
          onClick={() => publish()}
        >
          Publish Now
        </Button>
        <Button 
          variant="outline"
          onClick={() => schedulePublish()}
        >
          Schedule
        </Button>
      </div>
      
      <div>
        <Label>
          <Checkbox /> Password Protect
        </Label>
        {settings.password && (
          <Input 
            type="password"
            placeholder="Enter password"
            value={settings.password}
          />
        )}
      </div>
    </div>
  )
}
```

## 💡 Benefits of This System

1. **Brand Independence** - Each tenant has unique identity
2. **SEO Optimized** - Better Google ranking for each pondok
3. **Marketing Tool** - Built-in landing page for student recruitment
4. **Cost Effective** - No need separate website
5. **Easy Management** - Update content without coding
6. **Template Marketplace** - Additional revenue from premium templates
7. **Analytics** - Track visitor behavior
8. **Mobile Responsive** - Works on all devices

**This dual public page system with CMS makes your SaaS a complete solution!** 🚀