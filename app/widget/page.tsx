import { parseFeed, type Resource } from '@/lib/parseFeed';
import ResourceLibrary from '@/components/ResourceLibrary';

export const revalidate = 3600;

export default async function WidgetPage() {
  let resources: Resource[] = [];
  try {
    resources = await parseFeed();
  } catch {
    // show empty state
  }

  return <ResourceLibrary resources={resources} />;
}
