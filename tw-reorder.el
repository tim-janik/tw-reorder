;; This Source Code Form is licensed MPL-2.0: http://mozilla.org/MPL/2.0


;; Reformat the current buffer
(defun reformat-with (strategy)
  "Reformat the current buffer using STRATEGY."
  (let ((currentpoint (point))
        (winstart (window-start)))
    (save-mark-and-excursion ; save and restore mark, cursor, buffer
      (shell-command-on-region
       (point-min) (point-max)				; START END
       (funcall strategy)      				; COMMAND
       (get-buffer-create "*ReformatWith*")		; OUTPUT-BUFFER
       t						; REPLACE
       (get-buffer-create "*ReformatWithErrors*")	; ERROR-BUFFER
       t))						; DISPLAY-ERROR-BUFFER
    (goto-char currentpoint)				; reposition after buffer replacement
    (set-window-start (selected-window) winstart)	; reposition scroll offset *after* goto-char
    ))

;; Shell command to reformat tailwind classes via nodejs script
(defun tw-reorder-command ()
  (concat "cd " tw-reorder-command-dir " && node tw-reorder.js -b /dev/stdin")
  )
;; Dirname of this script to refer to tw-reorder.js
(setq tw-reorder-command-dir (file-name-directory load-file-name)) ; set by load-file

;; Command to reformat tailwind classes in cureent buffer via external script
(defun tw-reorder ()
  (interactive)
  (reformat-with 'tw-reorder-command))

;; Global key assignment for tw-reorder
(global-set-key (kbd "<f8>") 'tw-reorder)
