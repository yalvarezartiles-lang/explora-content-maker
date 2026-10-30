<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Student portal
- Keep student screens under the client-only `_authenticated` gate and preserve public landing routes; browser sessions cannot be validated during SSR.
- Use a private server-side DNI-to-email login resolver with persistent rate limits and generic errors; never expose identity resolution to anonymous clients.
- Keep profiles user-editable but student identity and roles school-managed in separate RLS tables; user metadata must never grant authority.
- Keep checkout preparatory until providers are connected; trusted server handlers must calculate totals and verify provider callbacks before marking orders paid.
- Store cart state only within the signed-in portal shell and clear private queries on sign-out; never restore another user's private state.
