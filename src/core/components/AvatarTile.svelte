<script>
  const { createEventDispatcher } = require("svelte");
  const { timestamp } = require("./timestamp.js");

  export let feed;
  export let time = false;

  let image = "images/icon.png";
  let name = feed;

  ssb.avatar(feed).then(data => {
    // console.log(`avatar for ${feed}`, data);
    if (data.image !== null) {
      image = patchfox.httpUrl(`/blobs/get/${data.image}`);
    }
    name = data.name;
  });

  const dispatch = createEventDispatcher();

  const click = () => {
    dispatch("click");
  };
</script>

<div class="tile tile-centered feed-display" on:click>
  <div class="tile-icon">
    <div class="example-tile-icon">
      <img src={image} class="avatar avatar-lg" alt={name} />
    </div>
  </div>
  <div class="tile-content">
    <div class="tile-title">{name}</div>
    <small class="tile-subtitle text-gray">
      {#if time}{timestamp(time)}{/if}
    </small>
  </div>
</div>
