# ase2024.basenji.org

The online catalog and results for the African Stock Exhibition of the Basenji Club of America’s 2024 National Specialty.

## Annual update process...

- [x] clone from previous year

- [x] update year references

- [x] update show logo

- [x] update event details (show date in `eleventy.js`)

- [x] acquire dogs.yaml

  > [!NOTE]
  >
  > ASE and Parade entries are _not_ deduplicated, and not alphabetical; having
  > the data come pre-cleaned would help. (Also see sub-bullet!)
  - [x] remove `address`, `zip`, `phone`, and `email` fields!

- [x] add standard extra information per dog (put after name for ease of updating!)

  ```
  ase: true
  parade: true
  armband: 0
  # ofaNum: 12345
  # absent: true
  # classPlace: 0
  # award: bob|bos
  ```

  > [!NOTE]
  >
  > Source of raw YAML _could_ theoretically add/calculate these fields.

- [x] get images for each dog to `src/static/media/dogs/`, use image ID from ASE registration site (`imageId` in YAML), _not_ the dog’s ID!

  ```sh
  pushd src/static/media/dogs # may need to create dogs directory!

  for id in $(grep imageId ../../../_data/dogs.yaml | awk '{ print $2 }'); \
  do \
      wget -O "${id}.jpg" "https://bcoa-ase-backend.spudnoggin.com/images/${id}"; \
  done
  ```

- [x] set up Netlify site (https://app.netlify.com/teams/jaredreisinger/projects)

- [x] add CNAME to BCOA basenji.org DNS servers (https://my.a2hosting.com/)

- [x] get OFA number using AKC registration number: (https://ofa.org/advanced-search/?quicksearch=...)

- [x] uncomment/update results after event (all only if needed):

  ```
  absent: true
  classPlace: 0
  award: bob|bos
  ```

### Technologies used:

- [Eleventy](https://www.11ty.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Alpine.js](https://github.com/alpinejs/alpine)
