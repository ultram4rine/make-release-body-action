# make-release-body-action

> Replacement of
>
> ```sh
> awk -v ver=$(grep 'version' package.json | awk -F: '{ print $2 }' | tr -d \ \",) '/^#+ \[/ { if (p) { exit }; if ($2 == "["ver"]") { p=1; next } } p && NF' CHANGELOG.md > changes.txt
> ```

Make release body from [`keep a changelog`](https://keepachangelog.com/en/1.0.0/). Companion for [softprops/action-gh-release](https://github.com/softprops/action-gh-release).

## Inputs

### `changelog`

**Required** The name of the `changelog` file. Default `"CHANGELOG.md"`.

### `version`

**Required** The version for which you want to extract the changes.

### `output`

The name of the output file.

## Outputs

### `changes`

Changes of the specified version.

## Example usage

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v3

  - name: Get the version
    id: get_version
    run: echo ::set-output name=VERSION::$(jq -r .version package.json)

  - name: Create release body file
    uses: ultram4rine/make-release-body-action@v1
    with:
      changelog: CHANGELOG.md
      version: ${{ steps.get_version.outputs.VERSION }}
      output: changes.txt

  - name: Create release
    uses: softprops/action-gh-release@v1
    with:
      body_path: changes.txt
```
