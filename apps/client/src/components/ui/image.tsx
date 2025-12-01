import { Image as UnpicImage } from "@unpic/react";

type ImageProps = React.ComponentProps<typeof UnpicImage>;

export function Image(props: ImageProps) {
  return <UnpicImage {...props} />;
}
