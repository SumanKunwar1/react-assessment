# Task 4: White-Label Configuration

## Goal
Transform the DataTable component into a configurable white-label solution that can be customized for different clients with unique themes, features, and branding requirements.

## Theme & Feature Configuration

### Configuration Structure
\`\`\`typescript
interface ClientConfig {
  id: string;
  name: string;
  theme: ClientTheme;
  features: ClientFeatures;
  branding: ClientBranding;
}

interface ClientTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
  };
  spacing: {
    compact: boolean;
    borderRadius: string;
  };
}

interface ClientFeatures {
  sorting: boolean;
  filtering: boolean;
  pagination: boolean;
  export: boolean;
  bulkActions: boolean;
  columnResize: boolean;
  rowSelection: boolean;
}
\`\`\`

### Client Configurations
\`\`\`typescript
const clientConfigs: Record<string, ClientConfig> = {
  'client-a': {
    id: 'client-a',
    name: 'TechCorp Solutions',
    theme: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#0ea5e9',
        background: '#ffffff',
        text: '#1e293b',
        border: '#e2e8f0'
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: { small: '12px', medium: '14px', large: '16px' }
      },
      spacing: { compact: false, borderRadius: '8px' }
    },
    features: {
      sorting: true,
      filtering: true,
      pagination: true,
      export: true,
      bulkActions: true,
      columnResize: true,
      rowSelection: true
    }
  },
  'client-b': {
    id: 'client-b',
    name: 'Creative Agency',
    theme: {
      colors: {
        primary: '#7c3aed',
        secondary: '#a78bfa',
        accent: '#c084fc',
        background: '#faf5ff',
        text: '#581c87',
        border: '#e9d5ff'
      },
      typography: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: { small: '11px', medium: '13px', large: '15px' }
      },
      spacing: { compact: true, borderRadius: '12px' }
    },
    features: {
      sorting: true,
      filtering: false,
      pagination: true,
      export: false,
      bulkActions: false,
      columnResize: false,
      rowSelection: true
    }
  }
};
\`\`\`

## Implementation

### Dynamic Theme Application
\`\`\`typescript
const WhiteLabelDataTable = <T,>({ 
  clientId, 
  data, 
  columns,
  ...props 
}: WhiteLabelDataTableProps<T>) => {
  const config = clientConfigs[clientId];
  
  // Generate CSS custom properties from theme
  const themeStyles = useMemo(() => ({
    '--color-primary': config.theme.colors.primary,
    '--color-secondary': config.theme.colors.secondary,
    '--color-accent': config.theme.colors.accent,
    '--color-background': config.theme.colors.background,
    '--color-text': config.theme.colors.text,
    '--color-border': config.theme.colors.border,
    '--font-family': config.theme.typography.fontFamily,
    '--font-size-small': config.theme.typography.fontSize.small,
    '--font-size-medium': config.theme.typography.fontSize.medium,
    '--font-size-large': config.theme.typography.fontSize.large,
    '--border-radius': config.theme.spacing.borderRadius,
  } as React.CSSProperties), [config]);

  return (
    <div 
      className={`white-label-table ${config.theme.spacing.compact ? 'compact' : ''}`}
      style={themeStyles}
    >
      <DataTable
        data={data}
        columns={columns}
        sortable={config.features.sorting}
        filterable={config.features.filtering}
        pagination={config.features.pagination}
        exportable={config.features.export}
        bulkActions={config.features.bulkActions}
        resizable={config.features.columnResize}
        selectable={config.features.rowSelection}
        {...props}
      />
    </div>
  );
};
\`\`\`

### Feature Toggle Implementation
\`\`\`typescript
const ConditionalFeature: React.FC<{
  enabled: boolean;
  children: React.ReactNode;
}> = ({ enabled, children }) => {
  return enabled ? <>{children}</> : null;
};

// Usage in DataTable
<ConditionalFeature enabled={config.features.export}>
  <ExportButton onExport={handleExport} />
</ConditionalFeature>
\`\`\`

### CSS Custom Properties Integration
\`\`\`css
.white-label-table {
  --primary: var(--color-primary);
  --secondary: var(--color-secondary);
  --accent: var(--color-accent);
  --background: var(--color-background);
  --text: var(--color-text);
  --border: var(--color-border);
  
  font-family: var(--font-family);
  background-color: var(--background);
  color: var(--text);
  border-radius: var(--border-radius);
}

.white-label-table.compact {
  --spacing-unit: 8px;
}

.white-label-table:not(.compact) {
  --spacing-unit: 16px;
}
\`\`\`

## Example: Client Comparison

### Client A (TechCorp Solutions)
- **Theme**: Professional blue color scheme with Inter font
- **Features**: Full feature set enabled (sorting, filtering, export, bulk actions)
- **Layout**: Standard spacing with rounded corners
- **Use Case**: Enterprise data management dashboard

### Client B (Creative Agency)  
- **Theme**: Creative purple gradient with Poppins font
- **Features**: Simplified feature set (sorting and selection only)
- **Layout**: Compact spacing with more rounded corners
- **Use Case**: Portfolio project management tool

### Visual Differences
\`\`\`typescript
// Client A renders with:
<WhiteLabelDataTable
  clientId="client-a"
  data={projects}
  columns={projectColumns}
/>
// Result: Blue theme, all features, standard spacing

// Client B renders with:
<WhiteLabelDataTable
  clientId="client-b" 
  data={projects}
  columns={projectColumns}
/>
// Result: Purple theme, limited features, compact spacing
\`\`\`

## Scalability

### Adding New Clients
1. **Define configuration** in `clientConfigs` object
2. **No code changes** required in components
3. **Automatic theme application** via CSS custom properties
4. **Feature toggles** work immediately

### Easy Expansion Points:
- **New theme properties** (shadows, animations, transitions)
- **Additional features** (advanced filtering, custom actions)
- **Branding elements** (logos, custom headers, footers)
- **Localization support** (RTL layouts, translations)

### Configuration Management:
\`\`\`typescript
// Future: Load from API or CMS
const loadClientConfig = async (clientId: string): Promise<ClientConfig> => {
  const response = await fetch(`/api/clients/${clientId}/config`);
  return response.json();
};

// Future: Runtime theme switching
const updateClientTheme = (clientId: string, updates: Partial<ClientTheme>) => {
  clientConfigs[clientId] = {
    ...clientConfigs[clientId],
    theme: { ...clientConfigs[clientId].theme, ...updates }
  };
};
\`\`\`

### Benefits for New Clients:
- **Zero development time** for basic customization
- **Consistent component behavior** across all clients
- **Maintainable codebase** with single source of truth
- **Flexible pricing models** based on feature sets enabled
