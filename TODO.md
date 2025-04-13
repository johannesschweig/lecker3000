# TODO
- skeleton loading home page

- option to change main image
- option to change title
- change language to German
  - button text will be long :(
- improve shadow styling: hard drop shadow
- remove/adapt line heights for text sizing
- double line breaks \n\n are not rendered correctly with <p>.

- delete recipe: dialogue or long press
  - difficult with animation, ugly with dialog
- Investigate: pass recipe as prop to recipeview: maybe makes it easier
  - https://router.vuejs.org/guide/essentials/passing-props
- add tags in fileupload
- option to change/add/rearrange multiple images
- disable save button if no change
- refresh of a recipe page should be possible without leading to an error page

# v0.7.0
- safelist.txt source -200 -300
- secure client secret with pkce flow
  - check if accessToken -> else redirect to login /
- allow loading of more than 25 thumbnails (currently 17 recipes)
# v0.6.0
- option to abort change when editing ingredients/instruction
- change images to be squared, cover fit
- tag text not selectable
- 1 column layout mobile
- ingredients/instructions text size larger text-lg

# v0.5.0
- added tags with dynamic tag colors
- automatic redirect
# v0.4.0
- reset scroll position after route change
- recipeview: long titles don't break
- extract header as component
- instruction and ingredients
- changed url
# v0.3.0
- restyling app
# v0.2.0
- remove old image files from dropbox
- load thumbnail if added recipe
- new file upload flow
# v0.1.0
- implemented oauth2 flow

# DROPPED
- thumbnail images on home page take long to load (5s, w480 4s)
  - also smaller widths are not faster