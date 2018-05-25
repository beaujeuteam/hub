import { Injectable } from 'angular-js-proxy';

@Injectable()
export class SocialUtils {

    /**
     * Replace all \n to br HTML element
     * @param {string} text
     *
     * @return {string}
     */
    nlToBr(text) {
        return text.replace(/\n/g, '<br/>');
    }

    /**
     * Replace all br HTML element to \n
     * @param {string} text
     *
     * @return {string}
     */
    brToNl(text) {
        return text.replace(/<br\/?>/g, '\n');
    }

    /**
     * Replace all link to a HTML element
     * @param {string} text
     *
     * @return {string}
     */
    linkToA(text) {
        return text.replace(/((?:https?:\/\/){1}[\w-]+(\.[\w-_]+)+\.?(\d+)?(\/[\w#-]+)*(\?[\w_&-=]+)?)/g, '<a href="$1" target="_blank">$1</a>');
    }

    /**
     * Remove html tags
     * @param {string} html
     *
     * @returns {string}
     */
    stripHtmlTags(html) {
        return html.replace(/(<([^>]+)>)/ig, '');
    }

    /**
     * Remove html script tags
     * @param {string} html
     *
     * @returns {string}
     */
    stripHtmlScriptTags(html) {
        return html.replace(/<\/?script>/ig, '');
    }

    /**
     * Parse youtube link and replace link to iframe
     * @param {HTMLElement} link
     */
    parseYoutubeLink(link, width = 500) {
        const createEmbedYoutubeVideo = function(id, width) {
            const height = Math.floor((315 * width) / 500);
            return `<iframe style="margin: 10px 0 10px 0;" width="${width}" height="${height}" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`;
        }

        const youtubeMatch = link.href.match(/youtu.be\/(.*)/i);
        const youtubeMatch2 = link.href.match(/youtube.com\/watch\?v=(.*)/i);

        if (youtubeMatch) {
            link.outerHTML = createEmbedYoutubeVideo(youtubeMatch[1], width);
        } else if (youtubeMatch2) {
            link.outerHTML = createEmbedYoutubeVideo(youtubeMatch2[1], width);
        }
    }

    /**
     * Parse sound cloud link and replace link to iframe
     * @param {HTMLElement} link
     */
    parseSoundcloudLink(link) {
        const createEmbedSoundCloudMusic = function(author, track) {
            return `<iframe style="margin: 10px 0 10px 0;" width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https://soundcloud.com/${author}/${track}&color=ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false"></iframe>`;
        }

        const soundCloudMatch = link.href.match(/soundcloud.com\/(.*)\/(.*)/i);

        if (soundCloudMatch) {
            link.outerHTML = createEmbedSoundCloudMusic(soundCloudMatch[1], soundCloudMatch[2]);
        }
    }

    /**
     * Parse text to find tags
     * @param {string} text
     *
     * @return {text}
     */
    parseTags(text) {
        return text.replace(/#([a-zA-Z0-8-_.]+)/g, '<a href="#/search/tag/$1" title="#$1">#$1</a>');
    }

    /**
     * Parse text to find mentions
     * @param {string} text
     *
     * @return {text}
     */
    parseMentions(text) {
        return text.replace(/@([a-zA-Z0-8-_.]+)/g, '<a href="#/search/user/$1" title="@$1">@$1</a>');
    }

    /**
     * Insert text at textarea caret
     * @param {TextareaElement} txtarea
     * @param {string} text
     */
    insertAtCaret(txtarea, text) {
        const scrollPos = txtarea.scrollTop;
        const caretPos = txtarea.selectionStart;

        const front = (txtarea.value).substring(0, caretPos);
        const back = (txtarea.value).substring(txtarea.selectionEnd, txtarea.value.length);

        txtarea.value = front + text + back;
        const newCaretPos = caretPos + text.length;
        txtarea.selectionStart = newCaretPos;
        txtarea.selectionEnd = newCaretPos;
        txtarea.focus();
        txtarea.scrollTop = scrollPos;
    }
}
