<script>
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte");
  const {
    isChannelFiltered,
    addFilter,
    deleteFilter
  } = require("../../core/platforms/ssb/abusePrevention.js");

  const { onMount, onDestroy } = require("svelte");

  let msgs = false;
  let error = false;
  export let channel = false;
  export let lt = false;

  let subscribed = false;
  let promise;
  let hidden = isChannelFiltered(channel) || false;

  if (!channel) {
    console.log("can't navigate to unnamed channel, going back to public");
    location = "?pkg=hub"; // force reload.
  }

  ssb.channelSubscribed(channel).then(s => (subscribed = s));

  // todo: move back into using stores.
  $: {
    document.title = `Patchfox - #${channel}`;

    let opts = {};
    if (lt) {
      opts.lt = lt;
    }
    promise = ssb
      .channel(channel, opts)
      .then(ms => {
        msgs = ms;
        window.scrollTo(0, 0);
      })
      .catch(n => {
        if (!error) {
          console.error("errrrooooor", n);
        }
      });
  }

  const subscriptionChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      ssb.channelSubscribe(channel).catch(() => (subscribed = false));
    } else {
      ssb.channelUnsubscribe(channel).catch(() => (subscribed = true));
    }
  };

  const hideChanged = ev => {
    let v = ev.target.checked;
    if (v) {
      addFilter({
        action: "hide",
        channel
      });
    } else {
      deleteFilter({
        action: "hide",
        channel
      });
    }
    location.reload()
  };

  const goNext = () => {
    let lt = msgs[msgs.length - 1].value.timestamp;
    msgs = [];
    patchfox.go("hub", "channel", {
      channel,
      lt
    });
  };
  const goPrevious = () => {
    history.back();
  };
</script>

<style>
  .menu-right {
    right: 0px;
    left: unset;
    min-width: 300px;
  }
</style>

<div class="container">
  <div class="columns">
    <div class="column col-3">
      <h4>#{channel}</h4>
    </div>
    <div class="column">
      <label class="form-switch float-right">
        <input type="checkbox" on:change={hideChanged} bind:checked={hidden} />
        <i class="form-icon" />
        Hide messages from this channel
      </label>
      <label class="form-switch float-right">
        <input
          type="checkbox"
          on:change={subscriptionChanged}
          bind:checked={subscribed} />
        <i class="form-icon" />
        Subscribe
      </label>
      <button
        class="btn btn-link float-right"
        href="?pkg=post&view=compose&channel={channel}"
        on:click|preventDefault={() => patchfox.go('post', 'compose', {
            channel
          })}>
        New Post
      </button>
    </div>
  </div>
</div>
{#if error}
  <div class="toast toast-error">Error: {error}</div>
{/if}
{#if isChannelFiltered(channel)}
  <p>This channel is being filtered.</p>
{:else}
  {#await promise}
    <div class="loading loading-lg" />
  {:then}
    {#each msgs as msg (msg.key)}
      <MessageRenderer {msg} />
    {:else}
      <p>No messages.</p>
    {/each}
    <ul class="pagination">
      <li class="page-item page-previous">
        <a href="#" on:click|stopPropagation|preventDefault={goPrevious}>
          <div class="page-item-subtitle">Previous</div>
        </a>
      </li>
      <li class="page-item page-next">
        <a href="#" on:click|stopPropagation|preventDefault={goNext}>
          <div class="page-item-subtitle">Next</div>
        </a>
      </li>
    </ul>
  {/await}
{/if}
